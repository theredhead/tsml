import { UserResizableView } from "./UserResizableView";
import { Rect } from "./Rect";
import { UIView } from "./View";
export declare class UserDraggableView extends UserResizableView {
    private _constrainWithin;
    get constrainWithin(): Rect | null;
    set constrainWithin(v: Rect | null);
    private _isDraggable;
    get isDraggable(): boolean;
    set isDraggable(v: boolean);
    private _dragHandleView;
    get dragHandleView(): UIView | null;
    set dragHandleView(v: UIView | null);
    constructor(aRect: Rect);
}
