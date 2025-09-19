export type Token<T = any> = symbol | string | (new (...args: any[]) => T);
export type Lifetime = "singleton" | "scoped" | "transient";

export interface ServiceDescriptor<T = any> {
  token: Token<T>;
  lifetime?: Lifetime; // default 'transient'
  useClass?: new (...args: any[]) => T;
  useFactory?: (c: DIContainer) => T;
  useValue?: T;
  deps?: Token[];
  props?: Record<string, Token>;
}

export type TypeProvider =
  | {
      kind: "class";
      ctor: new (...args: any[]) => any;
      deps?: Token[];
      props?: Record<string, Token>;
    }
  | { kind: "factory"; factory: (c: DIContainer) => any }
  | { kind: "alias"; token: Token };

export interface NamespaceTypes {
  uri: string; // e.g. "@theredhead/ui"
  types: Record<string, TypeProvider | Token>; // localName -> provider or token
  defaults?: { contentProp?: string };
  typeMeta?: Record<string, { contentProp?: string }>;
}

export class DIContainer {
  // ---- services (DI) ----
  private services = new Map<Token, ServiceDescriptor>();
  private singletons = new Map<Token, any>();
  private scoped = new Map<Token, any>();
  constructor(private parent?: DIContainer) {}

  createScope(): DIContainer {
    return new DIContainer(this);
  }

  register<T>(desc: ServiceDescriptor<T>): this {
    this.root().services.set(desc.token, { lifetime: "transient", ...desc });
    return this;
  }

  resolve<T>(token: Token<T>): T {
    const desc = this.lookup(token);
    if (!desc)
      throw new Error(`Service not registered for token: ${String(token)}`);

    const lifetime = desc.lifetime ?? "transient";
    if (lifetime === "singleton") {
      const root = this.root();
      if (root.singletons.has(token)) return root.singletons.get(token);
      const inst = this.instantiate(desc);
      root.singletons.set(token, inst);
      return inst;
    }
    if (lifetime === "scoped") {
      if (this.scoped.has(token)) return this.scoped.get(token);
      const inst = this.instantiate(desc);
      this.scoped.set(token, inst);
      return inst;
    }
    return this.instantiate(desc);
  }

  private root(): DIContainer {
    return this.parent ? this.parent.root() : this;
  }

  private lookup(token: Token): ServiceDescriptor | undefined {
    return this.services.get(token) ?? this.parent?.lookup(token);
  }

  private instantiate(desc: ServiceDescriptor): any {
    if (desc.useValue !== undefined) return desc.useValue;
    if (desc.useFactory) return desc.useFactory(this);

    const Ctor = desc.useClass as new (...args: any[]) => any;
    if (!Ctor) throw new Error("Descriptor needs useClass/useFactory/useValue");

    const deps = (Ctor as any).__di?.deps ?? desc.deps ?? [];
    const args = deps.map((t: Token<any>) => this.resolve(t));
    const instance = new Ctor(...args);

    const props = (Ctor as any).__di?.props ?? desc.props ?? {};
    for (const [k, tok] of Object.entries(props))
      (instance as any)[k] = this.resolve(tok as Token<any>);

    return instance;
  }

  // ---- XML type registry by URI (for TS-XAML factory) ----
  private byUri = new Map<string, Map<string, TypeProvider>>();
  private defaultsByUri = new Map<string, NamespaceTypes["defaults"]>();
  private typeMetaByUri = new Map<
    string,
    Map<string, { contentProp?: string }>
  >();

  useTypes(pkg: NamespaceTypes): this {
    const m = this.byUri.get(pkg.uri) ?? new Map();
    for (const [name, val] of Object.entries(pkg.types)) {
      if (
        typeof val === "symbol" ||
        typeof val === "string" ||
        typeof val === "function"
      ) {
        m.set(name, { kind: "alias", token: val as Token });
      } else {
        m.set(name, val as TypeProvider);
      }
    }
    this.byUri.set(pkg.uri, m);
    if (pkg.defaults) this.defaultsByUri.set(pkg.uri, pkg.defaults);
    if (pkg.typeMeta) {
      const meta = this.typeMetaByUri.get(pkg.uri) ?? new Map();
      for (const [k, v] of Object.entries(pkg.typeMeta)) meta.set(k, v);
      this.typeMetaByUri.set(pkg.uri, meta);
    }
    return this;
  }

  overrideType(
    uri: string,
    name: string,
    provider: TypeProvider | Token
  ): this {
    const m = this.byUri.get(uri) ?? new Map();
    const final: TypeProvider =
      typeof provider === "symbol" ||
      typeof provider === "string" ||
      typeof provider === "function"
        ? { kind: "alias", token: provider as Token }
        : (provider as TypeProvider);
    m.set(name, final);
    this.byUri.set(uri, m);
    return this;
  }

  resolveType(uri: string | null, local: string): TypeProvider {
    if (!uri) throw new Error(`Missing namespace URI for <${local}>`);
    const m = this.byUri.get(uri);
    if (!m) throw new Error(`Unregistered namespace URI '${uri}'`);
    const p = m.get(local);
    if (!p) throw new Error(`Type '${local}' not found under '${uri}'`);
    return p;
  }

  getDefaults(uri: string | null) {
    return (uri && this.defaultsByUri.get(uri)) ?? {};
  }
  getTypeMeta(uri: string | null, local: string) {
    return (uri && this.typeMetaByUri.get(uri)?.get(local)) ?? {};
  }

  constructXmlType(uri: string, local: string): any {
    const prov = this.resolveType(uri, local);
    if (prov.kind === "alias") return this.resolve(prov.token);
    if (prov.kind === "factory") return prov.factory(this);
    const Ctor = prov.ctor as any;
    const desc: ServiceDescriptor = {
      token: Ctor,
      useClass: Ctor,
      deps: prov.deps,
      props: prov.props,
      lifetime: "transient",
    };
    return this.instantiate(desc);
  }
}
