export declare function Observable(alsoNotifyFor?: string[]): (proto: any, key: string) => void;
/** Bridges child notifications upward as `${key}.${childPath}`. */
export declare function ObservableChild(alsoNotifyFor?: string[]): (proto: any, key: string) => void;
export declare function Computed(...deps: string[]): (proto: any, key: string, desc: PropertyDescriptor) => PropertyDescriptor;
