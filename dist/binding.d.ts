export type ConverterFn = (v: any, ...args: string[]) => any;
export interface Converters {
    [name: string]: ConverterFn;
}
export type BindMode = 'oneWay' | 'twoWay' | 'oneTime';
export interface BindingSpec {
    path: string;
    mode: BindMode;
    pipes: Array<{
        name: string;
        args: string[];
    }>;
}
export declare class BindingEngine {
    private converters;
    constructor(converters?: Converters);
    parse(expr: string): BindingSpec | null;
    getPath(obj: any, path: string): any;
    setPath(obj: any, path: string, value: any): void;
    applyConverters(v: any, pipes: BindingSpec['pipes']): any;
    bind(spec: BindingSpec, source: any, targetObj: any, targetProp: string, updateHook?: () => any): () => void;
}
