import { UIElement } from "./UIElement";
import { Rect } from "./Rect";
import { Size } from "./Size";
import { typeId, RectMake, PointMake, resizeProportionally } from "./functions";

export enum AutoresizingMask {
  LockedTop = 1,
  LockedLeft = 2,
  LockedBottom = 4,
  LockedRight = 8,
  WidthSizable = 16,
  HeightSizable = 32,
}

export let ResizeWithParent =
  AutoresizingMask.HeightSizable |
  AutoresizingMask.WidthSizable |
  AutoresizingMask.LockedLeft |
  AutoresizingMask.LockedRight |
  AutoresizingMask.LockedTop |
  AutoresizingMask.LockedBottom;

var viewId = 0;
export class UIView extends UIElement {
  public get frame(): Rect {
    return this._frame;
  }

  public set frame(v: Rect) {
    if (!this._frame.isEquivalentTToRect(v) && !v.isNegativeRect) {
      let oldFrame = this._frame;
      this.willUpdateFrame(oldFrame, v);
      this._frame = v;
      this.applyFrame();
      this.didUpdateFrame(oldFrame, v);
    }
  }

  public get minimumWidth(): number {
    if (this.minimumSize) {
      return this.minimumSize.width;
    }
    return 0;
  }
  public get minimumHeight(): number {
    if (this.minimumSize) {
      return this.minimumSize.height;
    }
    return 0;
  }
  public get maximumWidth(): number {
    if (this.maximumSize) {
      return this.maximumSize.width;
    }
    return window.innerWidth;
  }
  public get maximumHeight(): number {
    if (this.maximumSize) {
      return this.maximumSize.height;
    }
    return window.innerHeight;
  }

  private _identifier: string;
  private _minimumSize?: Size;
  public get minimumSize(): Size | undefined {
    return this._minimumSize;
  }

  public set minimumSize(v: Size | undefined) {
    this._minimumSize = v;
  }

  private _maximumSize?: Size;
  public get maximumSize(): Size | undefined {
    return this._maximumSize;
  }

  public set maximumSize(v: Size | undefined) {
    this._maximumSize = v;
  }

  public get identifier(): string {
    return this._identifier;
  }

  public set identifier(v: string) {
    this._identifier = v;
  }

  public toString(): string {
    return this.identifier;
  }

  private _parentView?: UIView;
  public get parentView(): UIView | undefined {
    return this._parentView;
  }

  public set parentView(aView: UIView) {
    this._parentView = aView;
  }

  private _autoresizingMask: number =
    AutoresizingMask.LockedTop | AutoresizingMask.LockedLeft;
  public get autoresizingMask(): number {
    return this._autoresizingMask;
  }

  public set autoresizingMask(v: number) {
    if ((this._autoresizingMask = v)) {
      this._autoresizingMask = v;
    }
  }

  private _autoresizesSubviews: boolean = true;
  public get autoresizesSubviews(): boolean {
    return this._autoresizesSubviews;
  }

  public set autoresizesSubviews(v: boolean) {
    this._autoresizesSubviews = v;
  }

  public willUpdateFrame(oldFrame: Rect, newFrame: Rect): void {
    if (this.minimumSize && newFrame.size.width < this.minimumSize.width) {
      newFrame.size.width = this.minimumSize.width;
    }
    if (this.minimumSize && newFrame.size.height < this.minimumSize.height) {
      newFrame.size.height = this.minimumSize.height;
    }
    if (this.maximumSize && newFrame.size.width > this.maximumSize.width) {
      newFrame.size.width = this.maximumSize.width;
    }
    if (this.maximumSize && newFrame.size.height > this.maximumSize.height) {
      newFrame.size.height = this.maximumSize.height;
    }

    this.resizeSubviews(oldFrame.size, newFrame.size);
  }

  public didUpdateFrame(oldFrame: Rect, newFrame: Rect): void {
    // console.log(this.identifier + ' updated frame from ' + oldFrame + ' to ' + newFrame);
  }

  public removeAllSubviews() {
    const old = this._subViews;
    this._subViews = [];
    return old;
  }

  public resizeSubviews(oldSize: Size, newSize: Size): void {
    if (oldSize != null) {
      if (this.autoresizesSubviews) {
        var oldRect = RectMake(0, 0, oldSize.width, oldSize.height);
        for (var ix = 0; ix < this._subViews.length; ix++) {
          var sub = this._subViews[ix],
            frame = sub.frame.copy(),
            rect = resizeProportionally(sub.frame, oldSize, newSize);

          if (
            (sub.autoresizingMask & AutoresizingMask.LockedLeft) ==
            AutoresizingMask.LockedLeft
          ) {
            rect.origin.x = sub.frame.origin.x;
          }
          if (
            (sub.autoresizingMask & AutoresizingMask.LockedTop) ==
            AutoresizingMask.LockedTop
          ) {
            rect.origin.y = sub.frame.origin.y;
          }
          if (
            (sub.autoresizingMask & AutoresizingMask.LockedRight) ==
            AutoresizingMask.LockedRight
          ) {
            var distanceFromOldRight =
              oldSize.width - (frame.size.width + frame.origin.x);
            rect.size.width =
              newSize.width - rect.origin.x - distanceFromOldRight;
          }
          if (
            (sub.autoresizingMask & AutoresizingMask.LockedBottom) ==
            AutoresizingMask.LockedBottom
          ) {
            var distanceFromOldBottom =
              oldSize.height - (frame.size.height + frame.origin.y);
            rect.size.height =
              newSize.height - rect.origin.y - distanceFromOldBottom;
          }

          //((s,r) => {window.setTimeout(() => {s.frame = r;}, 1);})(sub, rect);
          sub.frame = rect;
        }
      }
      // else
      // console.log(this.identifier + ' does not resize subViews');
    }
  }

  public applyFrame(): void {
    for (let ix = 0; ix < this._subViews.length; ix++) {
      let view = this._subViews[ix];
      view.applyFrame();
    }
    super.applyFrame();
  }

  private _isResizing: boolean;
  public get isResizing(): boolean {
    return this._isResizing;
  }

  public set isResizing(v: boolean) {
    ``;
    this._isResizing = v;
  }

  private _isBeingDragged: boolean;
  public get isBeingDragged(): boolean {
    return this._isBeingDragged;
  }

  public set isBeingDragged(v: boolean) {
    this._isBeingDragged = v;
  }

  private _allowDragAndDrop: boolean = false;
  public get allowDragAndDrop(): boolean {
    return this._allowDragAndDrop;
  }

  public set allowDragAndDrop(v: boolean) {
    this._allowDragAndDrop = v;
  }

  private _subViews: UIView[] = [];
  public get subViews(): UIView[] {
    return this._subViews;
  }

  public addSubview(aView: UIView): UIView {
    this._subViews.push(aView);
    aView._parentView = this;
    this.element.appendChild(aView.element);
    return aView;
  }

  public removeSubview(aView: UIView): UIView {
    this._subViews.splice(this._subViews.indexOf(aView));
    if (this.element.contains(aView.element)) {
      this.element.removeChild(aView.element);
    }
    return aView;
  }

  public center(inRect: Rect | null = null): void {
    var parentFrame = inRect ?? this._parentView!.frame,
      myFrame = this.frame,
      offsetX = parentFrame.size.width / 2 - myFrame.size.width / 2,
      offsetY = parentFrame.size.height / 2 - myFrame.size.height / 2;
    this.frame.origin = PointMake(offsetX, offsetY);
    this.applyFrame();
  }

  constructor(frame: Rect) {
    super(frame);

    let typeName = typeId(this);
    this._identifier = "_" + (viewId++).toString();
    this.addCssClass(typeName);
    this.element.setAttribute("id", this._identifier);
    this._isBeingDragged = false;
    this._isResizing = false;

    var me = this;
    this.element.addEventListener("mousedown", (e) => {
      me.mouseDown(e);
    });
    this.element.addEventListener("mouseup", (e) => {
      me.mouseUp(e);
    });
  }

  public mouseDown(e: MouseEvent): void {}

  public mouseUp(e: MouseEvent): void {}

  public draw(): void {
    this.applyFrame();
    //this.applyFrame();
  }
}
