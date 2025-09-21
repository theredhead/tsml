import { UIView } from "./View";
import { Rect } from "./Rect";
export declare class UserResizableView extends UIView {
    private _isHorizontallySizable;
    get isHorizontallySizable(): boolean;
    set isHorizontallySizable(v: boolean);
    private _isVertictallySizable;
    get isVertictallySizable(): boolean;
    set isVertictallySizable(v: boolean);
    private _resizeBorderThickness;
    get resizeBorderThickness(): number;
    set resizeBorderThickness(v: number);
    private _sizeHandleHorizontallyLeft;
    private _sizeHandleHorizontallyRight;
    private _sizeHandleVerticallyTop;
    private _sizeHandleVerticallyallyBottom;
    private _sizeHandleTopLeft;
    private _sizeHandleTopRight;
    private _sizeHandleBottomLeft;
    private _sizeHandleBottomRight;
    constructor(aRect: Rect);
    applyFrame(): void;
}
