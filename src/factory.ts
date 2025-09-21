export interface BuildOptions {
  container: DIContainer;
  xPrefix?: string;
  defaultContentProp?: string;
  binding?: { engine: BindingEngine; context: unknown };
}
// #region Imports
import { DIContainer } from "./di.js";
import { DOMParser } from "xmldom";
import type { BindingEngine } from "./binding.js";
// #endregion

// #region Type Aliases & Constants
export type TagParts = { prefix: string | null; local: string };
const XML_MIME_TYPE = "application/xml";
const DEFAULT_CONTENT_PROP = "children";
const ATTR_ID = "id";
const ATTR_KEY = "key";
const ATTR_NAME = "name";
const ATTR_TYPE = "type";
const ATTR_FACTORY = "factory";
const ATTR_CONTENT = "content";
const XMLNS = "xmlns";
// #endregion

// Error Classes
class TSXamlFactoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TSXamlFactoryError";
  }
}

class RefNotFoundError extends TSXamlFactoryError {
  constructor(refId: string) {
    super(`Unknown x:ref '${refId}'`);
    this.name = "RefNotFoundError";
  }
}

class MissingRefIdError extends TSXamlFactoryError {
  constructor() {
    super("x:ref requires id");
    this.name = "MissingRefIdError";
  }
}

export class TSXamlFactory {
  // #region Properties
  private ids: Map<string, unknown> = new Map();
  private x: string;
  private defaultContent: string;
  // #endregion
  // #region Constructor
  constructor(private opts: BuildOptions) {
    this.x = opts.xPrefix ?? "x";
    this.defaultContent = opts.defaultContentProp ?? DEFAULT_CONTENT_PROP;
  }

  /**
   * Builds an object tree from XML using the factory options.
   * @param xml - The XML string to parse.
   * @returns The constructed object tree.
   */
  async build<T = unknown>(xml: string): Promise<T> {
    const doc = new DOMParser().parseFromString(xml, XML_MIME_TYPE);
    return (await this.node(doc.documentElement)) as T;
  }

  private parseTag(tag: string): TagParts {
    const i = tag.indexOf(":");
    return i === -1
      ? { prefix: null, local: tag }
      : { prefix: tag.slice(0, i), local: tag.slice(i + 1) };
  }

  private getChildren(el: Element): Element[] {
    if ((el as any).children) {
      return Array.from((el as any).children);
    }
    return <Element[]>(
      (<unknown>Array.from(el.childNodes).filter((n: any) => n.nodeType === 1))
    );
  }

  private getText(el: Element): string {
    return (el.textContent ?? "").trim();
  }

  private setProp(
    target: Record<string, unknown>,
    prop: string,
    value: unknown
  ): void {
    const cur = target[prop];
    if (cur && typeof (cur as any).add === "function") {
      Array.isArray(value)
        ? (value as unknown[]).forEach((v) => (cur as any).add(v))
        : (cur as any).add(value);
      return;
    }
    if (Array.isArray(cur)) {
      Array.isArray(value)
        ? (cur as unknown[]).push(...(value as unknown[]))
        : (cur as unknown[]).push(value);
      return;
    }
    if (Array.isArray(value)) target[prop] = value;
    else target[prop] = value;
  }

  private convert(raw: unknown, hint?: string): unknown {
    if (hint) {
      if (hint === "number") return Number(raw);
      if (hint === "boolean") return /^true|1|yes$/i.test(String(raw));
      if (hint === "date") return new Date(String(raw));
      if (hint === "string[]")
        return String(raw)
          .split(/\s*[\r\n]+\s*/)
          .filter(Boolean);
    }
    if (/^\d+(?:\.\d+)?$/.test(String(raw))) return Number(raw);
    if (/^(true|false)$/i.test(String(raw))) return /^true$/i.test(String(raw));
    return raw;
  }

  private tryBind(
    target: Record<string, unknown>,
    prop: string,
    raw: string,
    el?: Element
  ): boolean {
    const binding = this.opts.binding;
    if (!binding) return false;
    const spec = binding.engine.parse(raw);
    if (!spec) return false;
    const updateHook = () => target[prop];
    binding.engine.bind(
      spec,
      binding.context,
      target,
      prop,
      spec.mode === "twoWay" ? updateHook : undefined
    );
    return true;
  }

  private implicitSlotFor(el: Element, ctor: unknown): string | null {
    const inline = el.getAttribute(`${this.x}:content`);
    if (inline) return inline;
    const metaCtor =
      (ctor && (ctor as any).__tsx && (ctor as any).__tsx.contentProp) || null;
    if (metaCtor) return metaCtor;
    const typeMeta = this.opts.container.getTypeMeta(
      el.namespaceURI,
      this.parseTag(el.tagName).local
    );
    const pkg =
      typeof typeMeta === "object" && typeMeta !== null
        ? typeMeta.contentProp
        : null;
    if (pkg) return pkg;
    const defaults = this.opts.container.getDefaults(el.namespaceURI);
    const pkgDefault =
      typeof defaults === "object" && defaults !== null
        ? defaults.contentProp
        : null;
    if (pkgDefault) return pkgDefault;
    return this.defaultContent || null;
  }

  private isFrameworkAttr(name: string): boolean {
    return (
      name.startsWith(XMLNS) ||
      name === `${this.x}:${ATTR_ID}` ||
      name === `${this.x}:${ATTR_FACTORY}` ||
      name === `${this.x}:${ATTR_CONTENT}` ||
      name.startsWith(`${this.x}:`)
    );
  }

  private isRefValue(v: unknown): boolean {
    return typeof v === "string" && /^{\s*x:ref\s+([^}]+)\s*}$/i.test(v);
  }
  private refId(v: string): string | null {
    return v.match(/^{\s*x:ref\s+([^}]+)\s*}$/i)?.[1] ?? null;
  }

  private async node(el: Element): Promise<unknown> {
    const { prefix, local } = this.parseTag(el.tagName);
    if (prefix === this.x && local === "ref") {
      return this.resolveRefNode(el);
    }
    if (!prefix) {
      throw new Error(
        `Top-level elements must be qualified (got <${el.tagName}>)`
      );
    }
    const uri = el.namespaceURI!;
    const instance = this.opts.container.constructXmlType(uri, local);
    const Ctor = instance?.constructor;
    this.registerId(el, instance);
    this.applyAttributes(el, instance);
    await this.applyChildren(el, instance, Ctor);
    if (typeof instance.onCreated === "function") await instance.onCreated();
    return instance;
  }

  /** Resolves an x:ref node and returns the referenced object. */
  private resolveRefNode(el: Element): unknown {
    const id =
      el.getAttribute(ATTR_ID) ||
      el.getAttribute(ATTR_KEY) ||
      el.getAttribute(ATTR_NAME);
    if (!id) throw new MissingRefIdError();
    const obj = this.ids.get(id);
    if (!obj) throw new RefNotFoundError(id);
    return obj;
  }

  /** Registers an instance by x:id if present. */
  private registerId(el: Element, instance: Record<string, unknown>): void {
    const id = el.getAttribute(`${this.x}:${ATTR_ID}`);
    if (id) this.ids.set(id, instance);
  }

  /** Applies attributes from the XML element to the instance. */
  private applyAttributes(
    el: Element,
    instance: Record<string, unknown>
  ): void {
    for (const a of Array.from(el.attributes)) {
      if (this.isFrameworkAttr(a.name)) continue;
      const raw = a.value;
      if (this.isRefValue(raw)) {
        const rid = this.refId(raw)!;
        const ref = this.ids.get(rid);
        if (!ref) throw new RefNotFoundError(rid);
        this.setProp(instance, a.name, ref);
      } else if (!this.tryBind(instance, a.name, raw, el)) {
        this.setProp(instance, a.name, this.convert(raw));
      }
    }
  }

  /** Applies child elements to the instance, handling property elements and implicit content. */
  private async applyChildren(
    el: Element,
    instance: Record<string, unknown>,
    Ctor: unknown
  ): Promise<void> {
    for (const child of this.getChildren(el)) {
      const { prefix: cp, local: cl } = this.parseTag(child.tagName);
      if (!cp) {
        const inner = this.getChildren(child);
        const hint = child.getAttribute(`${this.x}:${ATTR_TYPE}`) || undefined;
        if (inner.length === 0) {
          const t = this.getText(child);
          if (!this.tryBind(instance, cl, t, child))
            this.setProp(instance, cl, this.convert(t, hint));
        } else if (inner.length === 1) {
          this.setProp(instance, cl, await this.node(inner[0]));
        } else {
          const vals: unknown[] = [];
          for (const ie of inner) vals.push(await this.node(ie));
          this.setProp(instance, cl, vals);
        }
      } else {
        const slot = this.implicitSlotFor(el, Ctor);
        if (!slot)
          throw new TSXamlFactoryError(
            `<${el.tagName}> has direct child <${
              (child as Element).tagName
            }> but no content slot declared.`
          );
        this.setProp(instance, slot, await this.node(child as Element));
      }
    }
  }
}
