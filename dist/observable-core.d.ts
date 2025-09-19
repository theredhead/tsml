export type KeyPath = string;
export type Observer<T = any> = (propertyPath: string, value: T) => void;
export type ObserverToken = symbol;
declare const OBS: unique symbol;
declare const TOK: unique symbol;
export declare class ObservableHost {
    private [OBS];
    private [TOK];
    registerObserver<T = any>(keyPath: KeyPath, observer: Observer<T>): ObserverToken;
    unregisterObserver(token: ObserverToken): void;
    /** propertyPath is the concrete path that changed, e.g. "address.city". */
    protected notify(propertyPath: string, value: any): void;
}
export {};
