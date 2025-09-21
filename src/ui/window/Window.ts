import { ContentView } from "../ContentView";
import { RectMake, SizeMake } from "../functions";
import { Rect } from "../Rect";
import { TitleBar } from "../TitleBar";
import { UserDraggableView } from "../UserDraggableView";
import { UIView } from "../View";
import { WindowTool } from "../WindowTool";
import { WindowManager } from "./WindowManager";

export enum WindowCloseReason {
  UserAction,
}

export enum WindowMinimizeReason {
  UserAction,
}

export class UIWindow extends UserDraggableView {
  private _delegate: any;

  public get delegate(): any {
    return this._delegate;
  }
  public set delegate(d: any) {
    this._delegate = d;
  }

  public get title(): string {
    return this._titleBar.title;
  }

  public set title(value: string) {
    this._titleBar.title = value;
  }

  private _titleBar: TitleBar;
  private _contentView: UIView = new UIView(RectMake(0, 0, 100, 100));
  public get contentView(): UIView {
    return this._contentView;
  }

  private _windowManager: WindowManager | undefined = undefined;
  public set windowManager(mgr: WindowManager | undefined) {
    this._windowManager = mgr;
  }
  private _canBecomeKey: boolean = false;

  //   private _closeTool: WindowTool;
  //   private _resizeTool: WindowTool;
  //   private _minimizeTool: WindowTool;

  private unminimizedElement: HTMLElement;

  public orderFront(): void {
    this.visible = false;
    this._windowManager?.orderFront(this);
  }

  public init(): void {
    this.addCssClass("Window");
    this.minimumSize = SizeMake(64, 64);
    this.clipsContent = false;
    this._canBecomeKey = true;

    this.isDraggable = true;
    this.dragHandleView = this._titleBar;
    this.addSubview(this._titleBar);
    var m = this.resizeBorderThickness;
    this._contentView = this.addSubview(
      new ContentView(
        RectMake(
          m,
          this._titleBar.frame.size.height,
          this.frame.size.width - m * 2,
          this.frame.size.height - this._titleBar.frame.size.height - m
        )
      )
    );
    this.allowDragAndDrop = true;
  }

  constructor(aRect: Rect | null = null) {
    super((aRect = aRect || RectMake(0, 0, 329, 200)));
    this.init();
    this._titleBar = new TitleBar(
      RectMake(
        this.resizeBorderThickness,
        this.resizeBorderThickness,
        this.frame.size.width - 2 * this.resizeBorderThickness,
        this.resizeBorderThickness + 26
      )
    );

    this._titleBar.closeTool.mouseUp = () => {
      this.close(WindowCloseReason.UserAction);
    };
    this._titleBar.minimizeTool.mouseUp = () => {
      this.minimize(WindowMinimizeReason.UserAction);
    };

    this.setupWindow();
    this.unminimizedElement = this.element;
    this.applyFrame();
  }

  public close(reason: WindowCloseReason = WindowCloseReason.UserAction): void {
    if (this.windowShouldClose(reason)) {
      this.windowWillClose();
      this.parentView?.removeSubview(this);
      this.windowDidClose();
    }
  }

  public windowShouldClose(reason: WindowCloseReason): boolean {
    if (this.delegate) {
      let fn = this.delegate.windowShouldClose;
      if (typeof fn == "function") {
        return fn.call(this.delegate, this, reason);
      }
    }
    return true;
  }

  public windowWillClose() {
    if (this.delegate) {
      let fn = this.delegate.windowDidClose;
      if (typeof fn == "function") {
        return fn.call(this.delegate, this);
      }
    }
  }

  public windowDidClose() {
    if (this.delegate) {
      let fn = this.delegate.windowDidClose;
      if (typeof fn == "function") {
        return fn.call(this.delegate, this);
      }
    }
  }

  public minimize(
    reason: WindowMinimizeReason = WindowMinimizeReason.UserAction
  ): void {
    if (this.windowShouldMinimize(reason)) {
      this.windowWillMinimize();
      // this.parentView.removeSubview(this);

      this.visible = false;

      this.windowDidMinimize();
    }
  }

  public windowShouldMinimize(reason: WindowMinimizeReason): boolean {
    if (this.delegate) {
      let fn = this.delegate.windowShouldMinimize;
      if (typeof fn == "function") {
        return fn.call(this.delegate, this, reason);
      }
    }
    return true;
  }

  public windowWillMinimize() {
    if (this.delegate) {
      let fn = this.delegate.windowWillMinimize;
      if (typeof fn == "function") {
        return fn.call(this.delegate, this);
      }
    }
  }

  public windowDidMinimize() {
    if (this.delegate) {
      let fn = this.delegate.windowDidMinimize;
      if (typeof fn == "function") {
        return fn.call(this.delegate, this);
      }
    }
  }

  public unminimize(
    reason: WindowMinimizeReason = WindowMinimizeReason.UserAction
  ): void {
    if (this.windowShouldUnMinimize(reason)) {
      this.windowWillUnMinimize();
      //this.parentView.removeSubview(this);
      this.windowDidUnMinimize();
    }
  }

  public windowShouldUnMinimize(reason: WindowMinimizeReason): boolean {
    if (this.delegate) {
      let fn = this.delegate.windowShouldUnMinimize;
      if (typeof fn == "function") {
        return fn.call(this.delegate, this, reason);
      }
    }
    return true;
  }

  public windowWillUnMinimize() {
    if (this.delegate) {
      let fn = this.delegate.windowWillUnMinimize;
      if (typeof fn == "function") {
        fn.call(this.delegate, this);
      }
    }
  }

  public windowDidUnMinimize() {
    if (this.delegate) {
      let fn = this.delegate.windowDidUnMinimize;
      if (typeof fn == "function") {
        fn.call(this.delegate, this);
      }
    }
  }

  public setupWindow(): void {}

  public applyFrame(): void {
    super.applyFrame();
    this._titleBar.frame = RectMake(
      this.resizeBorderThickness,
      this.resizeBorderThickness,
      this.frame.size.width - 2 * this.resizeBorderThickness,
      this.resizeBorderThickness + 26
    );
    let m = this.resizeBorderThickness;
    this._contentView.frame = RectMake(
      m,
      this._titleBar.frame.size.height,
      this.frame.size.width - m * 2,
      this.frame.size.height - this._titleBar.frame.size.height - m
    );
  }

  public mouseDown(e: MouseEvent): void {
    this.orderFront();
  }

  public mouseUp(e: MouseEvent): void {}

  public keyDown(e: KeyboardEvent) {}

  public keyUp(e: KeyboardEvent) {}
}
