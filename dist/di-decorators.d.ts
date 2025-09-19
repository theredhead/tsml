import type { Token } from './di.js';
export declare function Injectable(opts?: {
    deps?: Token[];
    props?: Record<string, Token>;
}): (Ctor: any) => void;
export declare function InjectProps(map: Record<string, Token>): (Ctor: any) => void;
