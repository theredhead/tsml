import { UIWindow } from "./Window";
import { UIView } from "../View";
export declare class WindowManager {
    private _front?;
    private _container;
    private _windows;
    private _dock;
    get windows(): UIWindow[];
    addWindow(window: UIWindow): void;
    orderFront(window: UIWindow): void;
    constructor(container: UIView);
}
