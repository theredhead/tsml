import { Rect } from "./Rect";
import { UIView } from "./View";
export declare class ViewDragManager {
    view: UIView;
    private offsetX;
    private offsetY;
    private mouseMoveHandler;
    private mouseUpHandler;
    private constrainTo;
    constrainWithin(rect: Rect | null): void;
    private handleMouseMove;
    private adjustToConstrainedFrame;
    private handleMouseRelease;
    constructor(e: MouseEvent, view: UIView);
}
