import { UIView } from "./View";
import { WindowSizeHandle } from "./window/WindowSizeHandle";
import { RectMake } from "./functions";
import { Rect } from "./Rect";
import { Resize, ViewResizeManager } from "./ViewResizeManager";

export class UserResizableView extends UIView {
  private _isHorizontallySizable: boolean = true;
  public get isHorizontallySizable(): boolean {
    return this._isHorizontallySizable;
  }

  public set isHorizontallySizable(v: boolean) {
    this._isHorizontallySizable = v;
  }

  private _isVertictallySizable: boolean = true;
  public get isVertictallySizable(): boolean {
    return this._isVertictallySizable;
  }

  public set isVertictallySizable(v: boolean) {
    this._isVertictallySizable = v;
  }

  private _resizeBorderThickness: number;
  public get resizeBorderThickness(): number {
    return Math.round(this._resizeBorderThickness);
  }

  public set resizeBorderThickness(v: number) {
    this._resizeBorderThickness = v;
  }

  private _sizeHandleHorizontallyLeft: WindowSizeHandle;
  private _sizeHandleHorizontallyRight: WindowSizeHandle;
  private _sizeHandleVerticallyTop: WindowSizeHandle;
  private _sizeHandleVerticallyallyBottom: WindowSizeHandle;
  private _sizeHandleTopLeft: WindowSizeHandle;
  private _sizeHandleTopRight: WindowSizeHandle;
  private _sizeHandleBottomLeft: WindowSizeHandle;
  private _sizeHandleBottomRight: WindowSizeHandle;

  constructor(aRect: Rect) {
    super(aRect);
    this._resizeBorderThickness = 4;
    var thickness = this._resizeBorderThickness;
    this._sizeHandleTopLeft = this.addSubview(
      new WindowSizeHandle(RectMake(0, 0, thickness, thickness))
    );
    this._sizeHandleTopLeft.setCursor("nw-resize");

    this._sizeHandleTopRight = this.addSubview(
      new WindowSizeHandle(
        RectMake(aRect.size.width - thickness, 0, thickness, thickness)
      )
    );
    this._sizeHandleTopRight.setCursor("ne-resize");

    this._sizeHandleBottomLeft = this.addSubview(
      new WindowSizeHandle(
        RectMake(0, aRect.size.height - thickness, thickness, thickness)
      )
    );
    this._sizeHandleBottomLeft.setCursor("sw-resize");

    this._sizeHandleBottomRight = this.addSubview(
      new WindowSizeHandle(
        RectMake(
          aRect.size.width - thickness,
          aRect.size.height - thickness,
          thickness,
          thickness
        )
      )
    );
    this._sizeHandleBottomRight.setCursor("se-resize");

    this._sizeHandleHorizontallyLeft = this.addSubview(
      new WindowSizeHandle(
        RectMake(0, thickness, thickness, aRect.size.height - 2 * thickness)
      )
    );
    this._sizeHandleHorizontallyLeft.setCursor("w-resize");

    this._sizeHandleHorizontallyRight = this.addSubview(
      new WindowSizeHandle(
        RectMake(
          aRect.size.width - thickness,
          thickness,
          thickness,
          aRect.size.height - 2 * thickness
        )
      )
    );
    this._sizeHandleHorizontallyRight.setCursor("e-resize");

    this._sizeHandleVerticallyTop = this.addSubview(
      new WindowSizeHandle(
        RectMake(thickness, 0, aRect.size.width - 2 * thickness, thickness)
      )
    );
    this._sizeHandleVerticallyTop.setCursor("n-resize");

    this._sizeHandleVerticallyallyBottom = this.addSubview(
      new WindowSizeHandle(
        RectMake(
          thickness,
          aRect.size.height - thickness,
          aRect.size.width - 2 * thickness,
          thickness
        )
      )
    );
    this._sizeHandleVerticallyallyBottom.setCursor("s-resize");

    // this.applyFrame();

    var theView = this;
    this._sizeHandleHorizontallyRight.mouseDown = (e: MouseEvent) => {
      if (!theView.isResizing && theView.isHorizontallySizable) {
        new ViewResizeManager(e, theView, Resize.East);
      }
    };
    this._sizeHandleHorizontallyLeft.mouseDown = (e: MouseEvent) => {
      if (!theView.isResizing && theView.isHorizontallySizable) {
        new ViewResizeManager(e, theView, Resize.West);
      }
    };
    this._sizeHandleVerticallyTop.mouseDown = (e: MouseEvent) => {
      if (!theView.isResizing && theView.isVertictallySizable) {
        new ViewResizeManager(e, theView, Resize.North);
      }
    };
    this._sizeHandleVerticallyallyBottom.mouseDown = (e: MouseEvent) => {
      if (!theView.isResizing && theView.isVertictallySizable) {
        new ViewResizeManager(e, theView, Resize.South);
      }
    };

    this._sizeHandleTopLeft.mouseDown = (e: MouseEvent) => {
      if (
        !theView.isResizing &&
        theView.isVertictallySizable &&
        theView.isHorizontallySizable
      ) {
        new ViewResizeManager(e, theView, Resize.North | Resize.West);
      }
    };
    this._sizeHandleTopRight.mouseDown = (e: MouseEvent) => {
      if (
        !theView.isResizing &&
        theView.isVertictallySizable &&
        theView.isHorizontallySizable
      ) {
        new ViewResizeManager(e, theView, Resize.North | Resize.East);
      }
    };
    this._sizeHandleBottomLeft.mouseDown = (e: MouseEvent) => {
      if (
        !theView.isResizing &&
        theView.isVertictallySizable &&
        theView.isHorizontallySizable
      ) {
        new ViewResizeManager(e, theView, Resize.South | Resize.West);
      }
    };
    this._sizeHandleBottomRight.mouseDown = (e: MouseEvent) => {
      if (
        !theView.isResizing &&
        theView.isVertictallySizable &&
        theView.isHorizontallySizable
      ) {
        new ViewResizeManager(e, theView, Resize.South | Resize.East);
      }
    };

    this.isHorizontallySizable = true;
    this.isVertictallySizable = true;
  }

  public applyFrame() {
    let thickness = this.resizeBorderThickness;
    this._sizeHandleTopLeft.frame = RectMake(0, 0, thickness, thickness);
    this._sizeHandleTopRight.frame = RectMake(
      this.frame.size.width - thickness,
      0,
      thickness,
      thickness
    );
    this._sizeHandleBottomLeft.frame = RectMake(
      0,
      this.frame.size.height - thickness,
      thickness,
      thickness
    );
    this._sizeHandleBottomRight.frame = RectMake(
      this.frame.size.width - thickness,
      this.frame.size.height - thickness,
      thickness,
      thickness
    );
    this._sizeHandleHorizontallyLeft.frame = RectMake(
      0,
      thickness,
      thickness,
      this.frame.size.height - 2 * thickness
    );
    this._sizeHandleHorizontallyRight.frame = RectMake(
      this.frame.size.width - thickness,
      thickness,
      thickness,
      this.frame.size.height - 2 * thickness
    );
    this._sizeHandleVerticallyTop.frame = RectMake(
      thickness,
      0,
      this.frame.size.width - 2 * thickness,
      thickness
    );
    this._sizeHandleVerticallyallyBottom.frame = RectMake(
      thickness,
      this.frame.size.height - thickness,
      this.frame.size.width - 2 * thickness,
      thickness
    );
    super.applyFrame();
  }
}
