import { UIElement } from "./UIElement";
import { Rect } from "./Rect";
import { Size } from "./Size";
export declare enum AutoresizingMask {
    LockedTop = 1,
    LockedLeft = 2,
    LockedBottom = 4,
    LockedRight = 8,
    WidthSizable = 16,
    HeightSizable = 32
}
export declare let ResizeWithParent: number;
export declare class UIView extends UIElement {
    get frame(): Rect;
    set frame(v: Rect);
    get minimumWidth(): number;
    get minimumHeight(): number;
    get maximumWidth(): number;
    get maximumHeight(): number;
    private _identifier;
    private _minimumSize?;
    get minimumSize(): Size | undefined;
    set minimumSize(v: Size | undefined);
    private _maximumSize?;
    get maximumSize(): Size | undefined;
    set maximumSize(v: Size | undefined);
    get identifier(): string;
    set identifier(v: string);
    toString(): string;
    private _parentView?;
    get parentView(): UIView | undefined;
    set parentView(aView: UIView);
    private _autoresizingMask;
    get autoresizingMask(): number;
    set autoresizingMask(v: number);
    private _autoresizesSubviews;
    get autoresizesSubviews(): boolean;
    set autoresizesSubviews(v: boolean);
    willUpdateFrame(oldFrame: Rect, newFrame: Rect): void;
    didUpdateFrame(oldFrame: Rect, newFrame: Rect): void;
    removeAllSubviews(): UIView[];
    resizeSubviews(oldSize: Size, newSize: Size): void;
    applyFrame(): void;
    private _isResizing;
    get isResizing(): boolean;
    set isResizing(v: boolean);
    private _isBeingDragged;
    get isBeingDragged(): boolean;
    set isBeingDragged(v: boolean);
    private _allowDragAndDrop;
    get allowDragAndDrop(): boolean;
    set allowDragAndDrop(v: boolean);
    private _subViews;
    get subViews(): UIView[];
    addSubview(aView: UIView): UIView;
    removeSubview(aView: UIView): UIView;
    center(inRect?: Rect | null): void;
    constructor(frame: Rect);
    mouseDown(e: MouseEvent): void;
    mouseUp(e: MouseEvent): void;
    draw(): void;
}
