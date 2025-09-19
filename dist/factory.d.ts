import { DIContainer } from "./di.js";
import type { BindingEngine } from "./binding.js";
export interface BuildOptions {
    container: DIContainer;
    xPrefix?: string;
    defaultContentProp?: string;
    binding?: {
        engine: BindingEngine;
        context: any;
    };
}
export declare class TSXamlFactory {
    private opts;
    private ids;
    private x;
    private defaultContent;
    constructor(opts: BuildOptions);
    build<T = any>(xml: string): Promise<T>;
    private q;
    private children;
    private text;
    private setProp;
    private convert;
    private tryBind;
    private implicitSlotFor;
    private isFrameworkAttr;
    private isRefValue;
    private refId;
    private node;
}
