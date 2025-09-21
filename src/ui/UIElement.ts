import { Rect } from "./Rect";
import { Color } from "./Color";
import { typeId } from "./functions";
import { settings } from "./settings";

export class UIElement {
  private _cursor?: string;
  private _color?: Color;
  private _backgroundColor?: Color;
  private _backgroundImage?: string;
  private _visible: boolean = true;

  public get visible(): boolean {
    return this._visible;
  }

  public set visible(v: boolean) {
    if (this._visible != v) {
      this._visible = v;
      this.element.style.visibility = this._visible ? "visible" : "hidden";
    }
  }

  public setCursor(crsr: string): void {
    this._cursor = crsr;
    this.applyFrame();
  }

  public setColor(color: Color) {
    this._color = color;
    this.applyFrame();
  }

  public setBackgroundColor(color: Color) {
    this._backgroundColor = color;
    this.applyFrame();
  }

  public setBackgroundImage(anImageUrl: string) {
    this._backgroundImage = anImageUrl;
    this.applyFrame();
  }

  private _clipsContent: boolean = true;
  public get clipsContent(): boolean {
    return this._clipsContent;
  }

  public set clipsContent(v: boolean) {
    this._clipsContent = v;
  }

  /**
   * treat as private.
   */
  public _frame: Rect;
  public get frame(): Rect {
    return this._frame;
  }

  public set frame(v: Rect) {
    if (!this._frame.isEquivalentTToRect(v)) {
      var oldFrame = this._frame;
      this.willUpdateFrame(oldFrame, v);
      this._frame = v;
      this.didUpdateFrame(oldFrame, v);
      this.applyFrame();
    }
  }

  public willUpdateFrame(oldFrame: Rect, newFrame: Rect): void {}

  public didUpdateFrame(oldFrame: Rect, newFrame: Rect): void {}

  private _element: HTMLElement;
  public get element(): HTMLElement {
    return this._element;
  }

  private _tagName: string = "div";
  public get tagName(): string {
    return this._tagName;
  }

  private _cssClasses: string[] = [];

  constructor(frame: Rect) {
    this.addCssClass("ui");
    this.addCssClass(typeId(this));
    this._frame = frame;
    this._element = document.createElement(this.tagName);
    //this.applyFrame();
  }

  public applyFrame(): void {
    this._element.style.position = "absolute";
    this._element.style.display = "block";
    this._element.style.top = this.frame.origin.y + "px";
    this._element.style.left = this.frame.origin.x + "px";
    this._element.style.height = this.frame.size.height + "px";
    this._element.style.width = this.frame.size.width + "px";

    if (this._cssClasses.length > 0)
      this._element.setAttribute("class", this.cssCasses.join(" "));
    else this._element.removeAttribute("class");

    if (this._cursor) this.element.style.cursor = this._cursor;
    if (this._backgroundColor)
      this.element.style.backgroundColor = this._backgroundColor.toString();
    if (this._backgroundImage)
      this.element.style.background = "url(" + this._backgroundImage + ")";

    if (this.clipsContent) this._element.style.clip = this.frame.toClipString();
    else this._element.style.clip = "";

    if (this._backgroundColor) {
      this._element.style.backgroundColor = this._backgroundColor.toString();
    }
    if (this._color) {
      this._element.style.color = this._color.toString();
    }

    if (this._visible) this._element.style.visibility = "visible";
    else this._element.style.visibility = "hidden";

    if (settings.debug && settings.displayRectInfo) {
      this.element.title = this.frame.toString();
    }
  }

  public get cssCasses(): string[] {
    return this._cssClasses;
  }

  public hasCssClass(aClass: string) {
    return this._cssClasses.indexOf(aClass) > -1;
  }

  public addCssClass(aClass: string) {
    if (!this.hasCssClass(aClass)) {
      this._cssClasses.push(aClass);
    }
  }

  public removeCssClass(aClass: string) {
    if (!this.hasCssClass(aClass)) {
      console.log("before removeClass:", this.cssCasses);
      this._cssClasses.splice(this._cssClasses.indexOf(aClass));
      console.log("after removeClass:", this.cssCasses);
    }
  }

  public toggleCssClass(aClass: string) {
    if (!this.hasCssClass(aClass)) {
      this.removeCssClass(aClass);
    } else {
      this.addCssClass(aClass);
    }
  }
}
