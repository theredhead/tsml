import { UIView } from "./View";
export declare enum Resize {
    North = 1,
    East = 2,
    South = 4,
    West = 8
}
export declare class ViewResizeManager {
    private view;
    private offsetX;
    private offsetY;
    private originalFrame;
    private resizeDirectionMask;
    private busy;
    private initialMouseEvent;
    private mouseMoveHandler;
    private mouseUpHandler;
    private constrain;
    private handleMouseMove;
    private handleMouseRelease;
    constructor(e: MouseEvent, view: UIView, directionMask: number);
}
