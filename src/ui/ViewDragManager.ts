import { RectMake } from "./functions";
import { Rect } from "./Rect";
import { UIView } from "./View";

export class ViewDragManager {
  view: UIView;
  private offsetX;
  private offsetY;

  private mouseMoveHandler: any;
  private mouseUpHandler: any;

  private constrainTo: Rect | null = null;

  public constrainWithin(rect: Rect | null) {
    this.constrainTo = rect;
  }

  private handleMouseMove(e: MouseEvent) {
    var newFrame = RectMake(
      e.x - this.offsetX,
      e.y - this.offsetY,
      this.view.frame.size.width,
      this.view.frame.size.height
    );
    var constrainedFrame = this.adjustToConstrainedFrame(newFrame);
    this.view.frame = constrainedFrame;
    this.view.applyFrame();
  }

  private adjustToConstrainedFrame(rect: Rect): Rect {
    if (this.constrainTo && this.constrainTo) {
      const adjusted: Rect = { ...rect } as Rect;
      const cf = this.constrainTo;
      if (cf.origin.x > rect.origin.x) {
        adjusted.origin.x = rect.origin.x;
      }
      if (cf.origin.y > rect.origin.y) {
        adjusted.origin.y = rect.origin.y;
      }
      if (
        adjusted.origin.x + adjusted.size.width >
        cf.origin.x + cf.size.width
      ) {
        const diffX =
          adjusted.origin.x +
          adjusted.size.width -
          (cf.origin.x + cf.size.width);
        adjusted.origin.x -= diffX;
      }
      if (
        adjusted.origin.y + adjusted.size.height >
        cf.origin.y + cf.size.height
      ) {
        const diffY =
          adjusted.origin.x +
          adjusted.size.height -
          (cf.origin.x + cf.size.height);
        adjusted.origin.y -= diffY;
      }
    }
    return rect;
  }

  private handleMouseRelease(e: MouseEvent) {
    document.removeEventListener("mousemove", this.mouseMoveHandler, true);
    document.removeEventListener("mouseup", this.mouseUpHandler, true);
    this.view.isBeingDragged = false;
    this.view.applyFrame();
  }

  constructor(e: MouseEvent, view: UIView) {
    this.view = view;
    this.view.isBeingDragged = true;
    this.offsetX = e.x - view.frame.origin.x;
    this.offsetY = e.y - view.frame.origin.y;

    this.mouseMoveHandler = (e: MouseEvent) => {
      this.handleMouseMove(e);
    };
    this.mouseUpHandler = (e: MouseEvent) => {
      this.handleMouseRelease(e);
    };
    document.addEventListener("mousemove", this.mouseMoveHandler, true);
    document.addEventListener("mouseup", this.mouseUpHandler, true);
  }
}
