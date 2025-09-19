import { DIContainer } from "./di.js";
import { DOMParser } from "xmldom";
import type { BindingEngine } from "./binding.js";

export interface BuildOptions {
  container: DIContainer;
  xPrefix?: string;
  defaultContentProp?: string;
  binding?: { engine: BindingEngine; context: any };
}

export class TSXamlFactory {
  private ids = new Map<string, any>();
  private x: string;
  private defaultContent: string;
  constructor(private opts: BuildOptions) {
    this.x = opts.xPrefix ?? "x";
    this.defaultContent = opts.defaultContentProp ?? "children";
  }

  async build<T = any>(xml: string): Promise<T> {
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    // xmldom does not provide querySelector, so check for parse errors differently if needed
    // For now, assume valid XML or handle errors at a higher level
    return (await this.node(doc.documentElement)) as T;
  }

  private q(tag: string) {
    const i = tag.indexOf(":");
    return i === -1
      ? { prefix: null, local: tag }
      : { prefix: tag.slice(0, i), local: tag.slice(i + 1) };
  }
  private children(el: Element) {
    // xmldom does not provide .children, use .childNodes and filter for element nodes
    if ((el as any).children) {
      return Array.from((el as any).children);
    }
    return Array.from(el.childNodes).filter((n: any) => n.nodeType === 1);
  }
  private text(el: Element) {
    return (el.textContent ?? "").trim();
  }

  private setProp(target: any, prop: string, value: any) {
    const cur = target[prop];
    if (cur && typeof cur.add === "function") {
      Array.isArray(value)
        ? value.forEach((v: any) => cur.add(v))
        : cur.add(value);
      return;
    }
    if (Array.isArray(cur)) {
      Array.isArray(value) ? cur.push(...value) : cur.push(value);
      return;
    }
    if (Array.isArray(value)) target[prop] = value;
    else target[prop] = value;
  }

  private convert(raw: any, hint?: string) {
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

  private tryBind(target: any, prop: string, raw: string, el?: Element) {
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

  private implicitSlotFor(el: Element, ctor: any): string | null {
    const inline = el.getAttribute(`${this.x}:content`);
    if (inline) return inline;
    const metaCtor =
      (ctor && (ctor as any).__tsx && (ctor as any).__tsx.contentProp) || null;
    if (metaCtor) return metaCtor;
    const typeMeta = this.opts.container.getTypeMeta(
      el.namespaceURI,
      this.q(el.tagName).local
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

  private isFrameworkAttr(name: string) {
    return (
      name.startsWith("xmlns") ||
      name === `${this.x}:id` ||
      name === `${this.x}:factory` ||
      name === `${this.x}:content` ||
      name.startsWith(`${this.x}:`)
    );
  }

  private isRefValue(v: any) {
    return typeof v === "string" && /^{\s*x:ref\s+([^}]+)\s*}$/i.test(v);
  }
  private refId(v: string) {
    return v.match(/^{\s*x:ref\s+([^}]+)\s*}$/i)?.[1] ?? null;
  }

  private async node(el: Element): Promise<any> {
    const { prefix, local } = this.q(el.tagName);
    if (prefix === this.x && local === "ref") {
      const id =
        el.getAttribute("id") ||
        el.getAttribute("key") ||
        el.getAttribute("name");
      if (!id) throw new Error("x:ref requires id");
      const obj = this.ids.get(id);
      if (!obj) throw new Error(`Unknown x:ref '${id}'`);
      return obj;
    }
    if (!prefix)
      throw new Error(
        `Top-level elements must be qualified (got <${el.tagName}>)`
      );

    const uri = el.namespaceURI!;
    const instance = this.opts.container.constructXmlType(uri, local);
    const Ctor = instance?.constructor;

    const id = el.getAttribute(`${this.x}:id`);
    if (id) this.ids.set(id, instance);

    // attributes
    for (const a of Array.from(el.attributes)) {
      if (this.isFrameworkAttr(a.name)) continue;
      const raw = a.value;
      if (this.isRefValue(raw)) {
        const rid = this.refId(raw)!;
        const ref = this.ids.get(rid);
        if (!ref)
          throw new Error(`Unknown x:ref '${rid}' in attribute '${a.name}'`);
        this.setProp(instance, a.name, ref);
      } else if (!this.tryBind(instance, a.name, raw, el)) {
        this.setProp(instance, a.name, this.convert(raw));
      }
    }

    // children: property elements or implicit content
    for (const child of this.children(el)) {
      const { prefix: cp, local: cl } = this.q(child.tagName);
      if (!cp) {
        const inner = this.children(child);
        const hint = child.getAttribute(`${this.x}:type`) || undefined;
        if (inner.length === 0) {
          const t = this.text(child);
          if (!this.tryBind(instance, cl, t, child))
            this.setProp(instance, cl, this.convert(t, hint));
        } else if (inner.length === 1) {
          this.setProp(instance, cl, await this.node(inner[0]));
        } else {
          const vals: any[] = [];
          for (const ie of inner) vals.push(await this.node(ie));
          this.setProp(instance, cl, vals);
        }
      } else {
        const slot = this.implicitSlotFor(el, Ctor);
        if (!slot)
          throw new Error(
            `<${el.tagName}> has direct child <${child.tagName}> but no content slot declared.`
          );
        this.setProp(instance, slot, await this.node(child));
      }
    }

    if (typeof instance.onCreated === "function") await instance.onCreated();
    return instance;
  }
}
