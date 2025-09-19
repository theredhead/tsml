export function generateTsFactory(xml, opts) {
    const funcName = opts.funcName ?? "buildTree";
    const x = opts.xPrefix ?? "x";
    const contentSlot = opts.contentSlot ?? (() => "children");
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    const err = doc.querySelector("parsererror");
    if (err)
        throw new Error("Invalid XML: " + err.textContent);
    const used = new Set();
    let seq = 0;
    const idsVar = "ids";
    const lines = [];
    const helpers = `
function setProp(target:any, key:string, value:any) {
  const cur = (target as any)[key];
  if (cur && typeof cur.add === 'function') { Array.isArray(value) ? value.forEach(v=>cur.add(v)) : cur.add(value); return; }
  if (Array.isArray(cur)) { Array.isArray(value) ? cur.push(...value) : cur.push(value); return; }
  if (Array.isArray(value)) (target as any)[key] = value; else (target as any)[key] = value;
}
function addToSlot(target:any, key:string, child:any) {
  const cur = (target as any)[key];
  if (cur && typeof cur.add === 'function') { cur.add(child); return; }
  if (Array.isArray(cur)) { cur.push(child); return; }
  if (cur === undefined) { (target as any)[key] = [child]; return; }
  (target as any)[key] = [child];
}
function conv(raw:string, hint?:string): any {
  if (hint) {
    if (hint === 'number') return Number(raw);
    if (hint === 'boolean') return /^true|1|yes$/i.test(raw);
    if (hint === 'date') return new Date(raw);
    if (hint === 'string[]') return raw.split(/\s*[\r\n]+\s*/).filter(Boolean);
  }
  if (/^\d+(?:\.\d+)?$/.test(raw)) return Number(raw);
  if (/^(true|false)$/i.test(raw)) return /^true$/i.test(raw);
  return raw;
}
`;
    function isRef(s) {
        return /^{\s*x:ref\s+([^}]+)\s*}$/i.test(s);
    }
    function refId(s) {
        const m = s.match(/^{\s*x:ref\s+([^}]+)\s*}$/i);
        return m ? m[1] : null;
    }
    function q(tag) {
        const i = tag.indexOf(":");
        return i === -1
            ? { prefix: null, local: tag }
            : { prefix: tag.slice(0, i), local: tag.slice(i + 1) };
    }
    function attrPairs(el) {
        return Array.from(el.attributes).filter((a) => !a.name.startsWith("xmlns") &&
            a.name !== `${x}:id` &&
            !a.name.startsWith(`${x}:`));
    }
    function ensureImport(p) {
        if (!p)
            return;
        used.add(p);
        if (!(p in opts.prefixImports))
            throw new Error(`Missing prefixImports['${p}']`);
    }
    function ctorExpr(el) {
        const { prefix, local } = q(el.tagName);
        if (!prefix)
            throw new Error(`Top-level class elements must be qualified (got <${el.tagName}>)`);
        ensureImport(prefix);
        return `new ${prefix}.${local}()`;
    }
    function newVar() {
        return `v${seq++}`;
    }
    function text(el) {
        return (el.textContent ?? "").trim();
    }
    function emitNode(el) {
        const ctor = ctorExpr(el);
        const v = newVar();
        lines.push(`const ${v} = ${ctor};`);
        const xid = el.getAttribute(`${x}:id`);
        if (xid)
            lines.push(`${idsVar}["${xid}"] = ${v};`);
        for (const a of attrPairs(el)) {
            const raw = a.value;
            if (isRef(raw)) {
                const rid = refId(raw);
                lines.push(`setProp(${v}, "${a.name}", ${idsVar}["${rid}"]);`);
            }
            else if (/^\d+(?:\.\d+)?$/.test(raw)) {
                lines.push(`${v}["${a.name}"] = ${Number(raw)};`);
            }
            else if (/^(true|false)$/i.test(raw)) {
                lines.push(`${v}["${a.name}"] = ${/^true$/i.test(raw)};`);
            }
            else {
                lines.push(`${v}["${a.name}"] = ${JSON.stringify(raw)};`);
            }
        }
        for (const child of Array.from(el.children)) {
            const { prefix: cp, local: cl } = q(child.tagName);
            if (!cp) {
                const hint = child.getAttribute(`${x}:type`);
                const inner = Array.from(child.children);
                if (inner.length === 0) {
                    const t = text(child);
                    if (hint)
                        lines.push(`setProp(${v}, "${cl}", conv(${JSON.stringify(t)}, ${JSON.stringify(hint)}));`);
                    else if (/^\d+(?:\.\d+)?$/.test(t))
                        lines.push(`setProp(${v}, "${cl}", ${Number(t)});`);
                    else if (/^(true|false)$/i.test(t))
                        lines.push(`setProp(${v}, "${cl}", ${/^true$/i.test(t)});`);
                    else
                        lines.push(`setProp(${v}, "${cl}", ${JSON.stringify(t)});`);
                }
                else if (inner.length === 1) {
                    const cv = emitNode(inner[0]);
                    lines.push(`setProp(${v}, "${cl}", ${cv});`);
                }
                else {
                    const arr = newVar();
                    lines.push(`const ${arr}: any[] = [];`);
                    for (const ie of inner) {
                        const iv = emitNode(ie);
                        lines.push(`${arr}.push(${iv});`);
                    }
                    lines.push(`setProp(${v}, "${cl}", ${arr});`);
                }
            }
            else {
                const slot = el.getAttribute(`${x}:content`) ?? contentSlot(el);
                if (!slot)
                    throw new Error(`<${el.tagName}> has direct child <${child.tagName}> but no content slot declared.`);
                const cv = emitNode(child);
                lines.push(`addToSlot(${v}, "${slot}", ${cv});`);
            }
        }
        return v;
    }
    const root = doc.documentElement;
    const rootVar = emitNode(root);
    const imports = [...used]
        .map((p) => `import * as ${p} from ${JSON.stringify(opts.prefixImports[p])};`)
        .join("\n");
    return `${imports}

${helpers}

export function ${funcName}(){
  const ${idsVar}: Record<string, any> = {};
${lines.map((l) => "  " + l).join("\n")}
  return ${rootVar};
}
`;
}
