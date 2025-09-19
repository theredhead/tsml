export type PrefixImports = Record<string, string>;
interface GenerateOptions {
    funcName?: string;
    xPrefix?: string;
    prefixImports: PrefixImports;
    contentSlot?: (el: Element) => string | null;
}
export declare function generateTsFactory(xml: string, opts: GenerateOptions): string;
export {};
