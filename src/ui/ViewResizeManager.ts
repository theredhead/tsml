import { Rect } from "./Rect";
import { UIView } from "./View";

export enum Resize {
  North = 1,
  East = 2,
  South = 4,
  West = 8,
}

export class ViewResizeManager {
  private view: UIView;
  private offsetX;
  private offsetY;
  private originalFrame: Rect;
  private resizeDirectionMask: number;
  private busy: boolean;
  private initialMouseEvent: MouseEvent;
  private mouseMoveHandler: any;
  private mouseUpHandler: any;

  private constrain(val: number, min: number, max: number): number {
    if (min && val < min) return min;
    if (max && val > max) return max;
    return val;
  }

  private handleMouseMove(e: MouseEvent) {
    if (this.busy) return;
    this.busy = true;
    e.preventDefault();
    var dir = this.resizeDirectionMask,
      frame = this.originalFrame.copy(),
      diffX = Math.round(this.initialMouseEvent.x - e.x),
      diffY = Math.round(this.initialMouseEvent.y - e.y);

    if ((dir & Resize.East) == Resize.East) {
      frame.size.width = Math.round(this.originalFrame.size.width - diffX);
    }
    if ((dir & Resize.West) == Resize.West) {
      frame.origin.x = Math.round(this.originalFrame.origin.x - diffX);
      frame.size.width = Math.round(this.originalFrame.size.width + diffX);
    }
    if ((dir & Resize.South) == Resize.South) {
      frame.size.height = Math.round(this.originalFrame.size.height - diffY);
    }
    if ((dir & Resize.North) == Resize.North) {
      frame.origin.y = Math.round(this.originalFrame.origin.y - diffY);
      frame.size.height = Math.round(this.originalFrame.size.height + diffY);
    }

    this.view.frame = frame;
    this.busy = false;
  }

  private handleMouseRelease(e: MouseEvent) {
    document.removeEventListener("mousemove", this.mouseMoveHandler, true);
    document.removeEventListener("mouseup", this.mouseUpHandler, true);
    this.view.isResizing = false;
    this.view.isBeingDragged = false;
    this.view.applyFrame();
  }

  constructor(e: MouseEvent, view: UIView, directionMask: number) {
    this.busy = true;
    this.initialMouseEvent = e;
    this.view = view;
    this.view.isResizing = true;
    this.originalFrame = this.view.frame;
    this.resizeDirectionMask = directionMask;
    this.offsetX = e.offsetX;
    this.offsetY = e.offsetY;

    this.mouseMoveHandler = (e: MouseEvent) => {
      this.handleMouseMove(e);
    };
    this.mouseUpHandler = (e: MouseEvent) => {
      this.handleMouseRelease(e);
    };
    document.addEventListener("mousemove", this.mouseMoveHandler, true);
    document.addEventListener("mouseup", this.mouseUpHandler, true);
    this.busy = false;
  }
}
