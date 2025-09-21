import { Rect } from "./Rect";
import { Color } from "./Color";
export declare class UIElement {
    private _cursor?;
    private _color?;
    private _backgroundColor?;
    private _backgroundImage?;
    private _visible;
    get visible(): boolean;
    set visible(v: boolean);
    setCursor(crsr: string): void;
    setColor(color: Color): void;
    setBackgroundColor(color: Color): void;
    setBackgroundImage(anImageUrl: string): void;
    private _clipsContent;
    get clipsContent(): boolean;
    set clipsContent(v: boolean);
    /**
     * treat as private.
     */
    _frame: Rect;
    get frame(): Rect;
    set frame(v: Rect);
    willUpdateFrame(oldFrame: Rect, newFrame: Rect): void;
    didUpdateFrame(oldFrame: Rect, newFrame: Rect): void;
    private _element;
    get element(): HTMLElement;
    private _tagName;
    get tagName(): string;
    private _cssClasses;
    constructor(frame: Rect);
    applyFrame(): void;
    get cssCasses(): string[];
    hasCssClass(aClass: string): boolean;
    addCssClass(aClass: string): void;
    removeCssClass(aClass: string): void;
    toggleCssClass(aClass: string): void;
}
