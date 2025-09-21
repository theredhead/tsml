import { Rect } from "../Rect";
import { UIView } from "../View";
export declare enum WindowToolType {
    Close = 0,
    Minimize = 1,
    Resize = 2
}
export declare class WindowTool extends UIView {
    constructor(rect: Rect, type: WindowToolType);
}
