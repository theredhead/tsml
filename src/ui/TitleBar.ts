import { UIView } from "./View";
import { TitleView } from "./TitleView";
import { WindowTool, WindowToolType } from "./WindowTool";
import { RectMake } from "./functions";
import { Rect } from "./Rect";

export class TitleBar extends UIView {
  private _tools: UIView;
  private _closeTool: WindowTool;
  private _resizeTool: WindowTool;
  private _minimizeTool: WindowTool;

  public get closeTool(): WindowTool {
    return this._closeTool;
  }
  public get minimizeTool(): WindowTool {
    return this._minimizeTool;
  }
  public get resizeTool(): WindowTool {
    return this._resizeTool;
  }

  public get title(): string {
    return this._titleView.element.innerText;
  }
  public set title(value: string) {
    this._titleView.element.innerText = value;
    this.applyFrame();
  }
  private _titleView: TitleView;

  public get forWindow(): Window {
    return this.parentView as unknown as Window;
  }

  constructor(aRect: Rect) {
    super(aRect);
    this.autoresizesSubviews = false;
    this._titleView = new TitleView(this.makeTitleViewRect());
    this._titleView.element.style.overflow = "ellipsis";
    this._titleView.clipsContent = true;
    this.addSubview(this._titleView);

    this._tools = this.addSubview(new UIView(RectMake(2, 2, 80, 20)));
    this._tools.addCssClass("WindowTools");
    this._tools.applyFrame();

    var y = 4,
      s = 12,
      o = 8;
    this._closeTool = this._tools.addSubview(
      new WindowTool(RectMake(o, y, s, s), WindowToolType.Close)
    );
    this._minimizeTool = this._tools.addSubview(
      new WindowTool(RectMake(o + 2 * s, y, s, s), WindowToolType.Minimize)
    );
    this._resizeTool = this._tools.addSubview(
      new WindowTool(RectMake(o + 4 * s, y, s, s), WindowToolType.Resize)
    );
    this.applyFrame();
  }
  applyFrame(): void {
    this._titleView.frame = this.makeTitleViewRect();
    this._titleView.applyFrame();
    super.applyFrame();
  }

  public makeTitleViewRect(): Rect {
    return RectMake(80, 4, this.frame.size.width - 80, 20);
  }
}
