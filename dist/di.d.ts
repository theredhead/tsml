export type Token<T = any> = symbol | string | (new (...args: any[]) => T);
export type Lifetime = "singleton" | "scoped" | "transient";
export interface ServiceDescriptor<T = any> {
    token: Token<T>;
    lifetime?: Lifetime;
    useClass?: new (...args: any[]) => T;
    useFactory?: (c: DIContainer) => T;
    useValue?: T;
    deps?: Token[];
    props?: Record<string, Token>;
}
export type TypeProvider = {
    kind: "class";
    ctor: new (...args: any[]) => any;
    deps?: Token[];
    props?: Record<string, Token>;
} | {
    kind: "factory";
    factory: (c: DIContainer) => any;
} | {
    kind: "alias";
    token: Token;
};
export interface NamespaceTypes {
    uri: string;
    types: Record<string, TypeProvider | Token>;
    defaults?: {
        contentProp?: string;
    };
    typeMeta?: Record<string, {
        contentProp?: string;
    }>;
}
export declare class DIContainer {
    private parent?;
    private services;
    private singletons;
    private scoped;
    constructor(parent?: DIContainer | undefined);
    createScope(): DIContainer;
    register<T>(desc: ServiceDescriptor<T>): this;
    resolve<T>(token: Token<T>): T;
    private root;
    private lookup;
    private instantiate;
    private byUri;
    private defaultsByUri;
    private typeMetaByUri;
    useTypes(pkg: NamespaceTypes): this;
    overrideType(uri: string, name: string, provider: TypeProvider | Token): this;
    resolveType(uri: string | null, local: string): TypeProvider;
    getDefaults(uri: string | null): "" | {
        contentProp?: string;
    };
    getTypeMeta(uri: string | null, local: string): "" | {
        contentProp?: string;
    };
    constructXmlType(uri: string, local: string): any;
}
