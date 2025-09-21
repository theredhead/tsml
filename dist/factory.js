"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TSXamlFactory = void 0;
const xmldom_1 = require("xmldom");
class TSXamlFactory {
    constructor(opts) {
        this.opts = opts;
        this.ids = new Map();
        this.x = opts.xPrefix ?? "x";
        this.defaultContent = opts.defaultContentProp ?? "children";
    }
    async build(xml) {
        const doc = new xmldom_1.DOMParser().parseFromString(xml, "application/xml");
        // xmldom does not provide querySelector, so check for parse errors differently if needed
        // For now, assume valid XML or handle errors at a higher level
        return (await this.node(doc.documentElement));
    }
    q(tag) {
        const i = tag.indexOf(":");
        return i === -1
            ? { prefix: null, local: tag }
            : { prefix: tag.slice(0, i), local: tag.slice(i + 1) };
    }
    children(el) {
        // xmldom does not provide .children, use .childNodes and filter for element nodes
        if (el.children) {
            return Array.from(el.children);
        }
        return Array.from(el.childNodes).filter((n) => n.nodeType === 1);
    }
    text(el) {
        return (el.textContent ?? "").trim();
    }
    setProp(target, prop, value) {
        const cur = target[prop];
        if (cur && typeof cur.add === "function") {
            Array.isArray(value)
                ? value.forEach((v) => cur.add(v))
                : cur.add(value);
            return;
        }
        if (Array.isArray(cur)) {
            Array.isArray(value) ? cur.push(...value) : cur.push(value);
            return;
        }
        if (Array.isArray(value))
            target[prop] = value;
        else
            target[prop] = value;
    }
    convert(raw, hint) {
        if (hint) {
            if (hint === "number")
                return Number(raw);
            if (hint === "boolean")
                return /^true|1|yes$/i.test(String(raw));
            if (hint === "date")
                return new Date(String(raw));
            if (hint === "string[]")
                return String(raw)
                    .split(/\s*[\r\n]+\s*/)
                    .filter(Boolean);
        }
        if (/^\d+(?:\.\d+)?$/.test(String(raw)))
            return Number(raw);
        if (/^(true|false)$/i.test(String(raw)))
            return /^true$/i.test(String(raw));
        return raw;
    }
    tryBind(target, prop, raw, el) {
        const binding = this.opts.binding;
        if (!binding)
            return false;
        const spec = binding.engine.parse(raw);
        if (!spec)
            return false;
        const updateHook = () => target[prop];
        binding.engine.bind(spec, binding.context, target, prop, spec.mode === "twoWay" ? updateHook : undefined);
        return true;
    }
    implicitSlotFor(el, ctor) {
        const inline = el.getAttribute(`${this.x}:content`);
        if (inline)
            return inline;
        const metaCtor = (ctor && ctor.__tsx && ctor.__tsx.contentProp) || null;
        if (metaCtor)
            return metaCtor;
        const typeMeta = this.opts.container.getTypeMeta(el.namespaceURI, this.q(el.tagName).local);
        const pkg = typeof typeMeta === "object" && typeMeta !== null
            ? typeMeta.contentProp
            : null;
        if (pkg)
            return pkg;
        const defaults = this.opts.container.getDefaults(el.namespaceURI);
        const pkgDefault = typeof defaults === "object" && defaults !== null
            ? defaults.contentProp
            : null;
        if (pkgDefault)
            return pkgDefault;
        return this.defaultContent || null;
    }
    isFrameworkAttr(name) {
        return (name.startsWith("xmlns") ||
            name === `${this.x}:id` ||
            name === `${this.x}:factory` ||
            name === `${this.x}:content` ||
            name.startsWith(`${this.x}:`));
    }
    isRefValue(v) {
        return typeof v === "string" && /^{\s*x:ref\s+([^}]+)\s*}$/i.test(v);
    }
    refId(v) {
        return v.match(/^{\s*x:ref\s+([^}]+)\s*}$/i)?.[1] ?? null;
    }
    async node(el) {
        const { prefix, local } = this.q(el.tagName);
        if (prefix === this.x && local === "ref") {
            const id = el.getAttribute("id") ||
                el.getAttribute("key") ||
                el.getAttribute("name");
            if (!id)
                throw new Error("x:ref requires id");
            const obj = this.ids.get(id);
            if (!obj)
                throw new Error(`Unknown x:ref '${id}'`);
            return obj;
        }
        if (!prefix)
            throw new Error(`Top-level elements must be qualified (got <${el.tagName}>)`);
        const uri = el.namespaceURI;
        const instance = this.opts.container.constructXmlType(uri, local);
        const Ctor = instance?.constructor;
        const id = el.getAttribute(`${this.x}:id`);
        if (id)
            this.ids.set(id, instance);
        // attributes
        for (const a of Array.from(el.attributes)) {
            if (this.isFrameworkAttr(a.name))
                continue;
            const raw = a.value;
            if (this.isRefValue(raw)) {
                const rid = this.refId(raw);
                const ref = this.ids.get(rid);
                if (!ref)
                    throw new Error(`Unknown x:ref '${rid}' in attribute '${a.name}'`);
                this.setProp(instance, a.name, ref);
            }
            else if (!this.tryBind(instance, a.name, raw, el)) {
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
                }
                else if (inner.length === 1) {
                    this.setProp(instance, cl, await this.node(inner[0]));
                }
                else {
                    const vals = [];
                    for (const ie of inner)
                        vals.push(await this.node(ie));
                    this.setProp(instance, cl, vals);
                }
            }
            else {
                const slot = this.implicitSlotFor(el, Ctor);
                if (!slot)
                    throw new Error(`<${el.tagName}> has direct child <${child.tagName}> but no content slot declared.`);
                this.setProp(instance, slot, await this.node(child));
            }
        }
        if (typeof instance.onCreated === "function")
            await instance.onCreated();
        return instance;
    }
}
exports.TSXamlFactory = TSXamlFactory;
