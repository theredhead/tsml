"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIContainer = void 0;
class DIContainer {
    constructor(parent) {
        this.parent = parent;
        // ---- services (DI) ----
        this.services = new Map();
        this.singletons = new Map();
        this.scoped = new Map();
        // ---- XML type registry by URI (for TS-XAML factory) ----
        this.byUri = new Map();
        this.defaultsByUri = new Map();
        this.typeMetaByUri = new Map();
    }
    createScope() {
        return new DIContainer(this);
    }
    register(desc) {
        this.root().services.set(desc.token, { lifetime: "transient", ...desc });
        return this;
    }
    resolve(token) {
        const desc = this.lookup(token);
        if (!desc)
            throw new Error(`Service not registered for token: ${String(token)}`);
        const lifetime = desc.lifetime ?? "transient";
        if (lifetime === "singleton") {
            const root = this.root();
            if (root.singletons.has(token))
                return root.singletons.get(token);
            const inst = this.instantiate(desc);
            root.singletons.set(token, inst);
            return inst;
        }
        if (lifetime === "scoped") {
            if (this.scoped.has(token))
                return this.scoped.get(token);
            const inst = this.instantiate(desc);
            this.scoped.set(token, inst);
            return inst;
        }
        return this.instantiate(desc);
    }
    root() {
        return this.parent ? this.parent.root() : this;
    }
    lookup(token) {
        return this.services.get(token) ?? this.parent?.lookup(token);
    }
    instantiate(desc) {
        if (desc.useValue !== undefined)
            return desc.useValue;
        if (desc.useFactory)
            return desc.useFactory(this);
        const Ctor = desc.useClass;
        if (!Ctor)
            throw new Error("Descriptor needs useClass/useFactory/useValue");
        const deps = Ctor.__di?.deps ?? desc.deps ?? [];
        const args = deps.map((t) => this.resolve(t));
        const instance = new Ctor(...args);
        const props = Ctor.__di?.props ?? desc.props ?? {};
        for (const [k, tok] of Object.entries(props))
            instance[k] = this.resolve(tok);
        return instance;
    }
    useTypes(pkg) {
        const m = this.byUri.get(pkg.uri) ?? new Map();
        for (const [name, val] of Object.entries(pkg.types)) {
            if (typeof val === "symbol" ||
                typeof val === "string" ||
                typeof val === "function") {
                m.set(name, { kind: "alias", token: val });
            }
            else {
                m.set(name, val);
            }
        }
        this.byUri.set(pkg.uri, m);
        if (pkg.defaults)
            this.defaultsByUri.set(pkg.uri, pkg.defaults);
        if (pkg.typeMeta) {
            const meta = this.typeMetaByUri.get(pkg.uri) ?? new Map();
            for (const [k, v] of Object.entries(pkg.typeMeta))
                meta.set(k, v);
            this.typeMetaByUri.set(pkg.uri, meta);
        }
        return this;
    }
    overrideType(uri, name, provider) {
        const m = this.byUri.get(uri) ?? new Map();
        const final = typeof provider === "symbol" ||
            typeof provider === "string" ||
            typeof provider === "function"
            ? { kind: "alias", token: provider }
            : provider;
        m.set(name, final);
        this.byUri.set(uri, m);
        return this;
    }
    resolveType(uri, local) {
        if (!uri)
            throw new Error(`Missing namespace URI for <${local}>`);
        const m = this.byUri.get(uri);
        if (!m)
            throw new Error(`Unregistered namespace URI '${uri}'`);
        const p = m.get(local);
        if (!p)
            throw new Error(`Type '${local}' not found under '${uri}'`);
        return p;
    }
    getDefaults(uri) {
        return (uri && this.defaultsByUri.get(uri)) ?? {};
    }
    getTypeMeta(uri, local) {
        return (uri && this.typeMetaByUri.get(uri)?.get(local)) ?? {};
    }
    constructXmlType(uri, local) {
        const prov = this.resolveType(uri, local);
        if (prov.kind === "alias")
            return this.resolve(prov.token);
        if (prov.kind === "factory")
            return prov.factory(this);
        const Ctor = prov.ctor;
        const desc = {
            token: Ctor,
            useClass: Ctor,
            deps: prov.deps,
            props: prov.props,
            lifetime: "transient",
        };
        return this.instantiate(desc);
    }
}
exports.DIContainer = DIContainer;
