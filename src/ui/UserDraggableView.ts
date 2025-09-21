import { UserResizableView } from "./UserResizableView";
import { ViewDragManager } from "./ViewDragManager";
import { Rect } from "./Rect";
import { UIView } from "./View";

export class UserDraggableView extends UserResizableView {
  private _constrainWithin: Rect | null = null;
  public get constrainWithin(): Rect | null {
    return this._constrainWithin || null;
  }
  public set constrainWithin(v: Rect | null) {
    this._constrainWithin = v;
  }

  private _isDraggable: boolean = false;
  public get isDraggable(): boolean {
    return this._isDraggable && this._dragHandleView != null;
  }
  public set isDraggable(v: boolean) {
    this._isDraggable = v;
  }

  private _dragHandleView: UIView | null = null;
  public get dragHandleView(): UIView | null {
    return this._dragHandleView || null;
  }
  public set dragHandleView(v: UIView | null) {
    if (v != this._dragHandleView) {
      this._dragHandleView = v;

      if (this.dragHandleView instanceof UIView) {
        if (this.isDraggable) {
          this.dragHandleView.mouseDown = (e: MouseEvent) => {
            var mgr = new ViewDragManager(e, this);
            mgr.constrainWithin(this.constrainWithin);
          };
        } else {
          this.dragHandleView.mouseDown = (e: MouseEvent) => {};
        }
      }
    }
  }

  constructor(aRect: Rect) {
    super(aRect);
  }
}
