/**
 * Class decorator to mix ObservableHost methods into a class prototype.
 */
export declare function ObservableClass<T extends {
    new (...args: any[]): {};
}>(Ctor: T): T;
export type KeyPath = string;
export type Observer<T = any> = (propertyPath: string, value: T) => void;
export type ObserverToken = symbol;
export declare class ObservableHost {
    private __ObservableHost_OBS;
    private __ObservableHost_TOK;
    constructor();
    registerObserver<T = any>(keyPath: KeyPath, observer: Observer<T>): ObserverToken;
    unregisterObserver(token: ObserverToken): void;
    /** propertyPath is the concrete path that changed, e.g. "address.city". */
    protected notify(propertyPath: string, value: any): void;
}
