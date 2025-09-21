import { UIWindow } from "./Window";
import { UIView } from "../View";
import { WindowTool } from "../WindowTool";
import { Rect } from "../Rect";
export declare class TitleBar extends UIView {
    private _tools;
    private _closeTool;
    private _resizeTool;
    private _minimizeTool;
    get closeTool(): WindowTool;
    get minimizeTool(): WindowTool;
    get resizeTool(): WindowTool;
    get title(): string;
    set title(value: string);
    private _titleView;
    get forWindow(): UIWindow;
    constructor(aRect: Rect);
    applyFrame(): void;
    makeTitleViewRect(): Rect;
}
