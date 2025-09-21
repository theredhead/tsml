"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleBar = void 0;
const View_1 = require("./View");
const TitleView_1 = require("./TitleView");
const WindowTool_1 = require("./WindowTool");
const functions_1 = require("./functions");
class TitleBar extends View_1.UIView {
    get closeTool() {
        return this._closeTool;
    }
    get minimizeTool() {
        return this._minimizeTool;
    }
    get resizeTool() {
        return this._resizeTool;
    }
    get title() {
        return this._titleView.element.innerText;
    }
    set title(value) {
        this._titleView.element.innerText = value;
        this.applyFrame();
    }
    get forWindow() {
        return this.parentView;
    }
    constructor(aRect) {
        super(aRect);
        this.autoresizesSubviews = false;
        this._titleView = new TitleView_1.TitleView(this.makeTitleViewRect());
        this._titleView.element.style.overflow = "ellipsis";
        this._titleView.clipsContent = true;
        this.addSubview(this._titleView);
        this._tools = this.addSubview(new View_1.UIView((0, functions_1.RectMake)(2, 2, 80, 20)));
        this._tools.addCssClass("WindowTools");
        this._tools.applyFrame();
        var y = 4, s = 12, o = 8;
        this._closeTool = this._tools.addSubview(new WindowTool_1.WindowTool((0, functions_1.RectMake)(o, y, s, s), WindowTool_1.WindowToolType.Close));
        this._minimizeTool = this._tools.addSubview(new WindowTool_1.WindowTool((0, functions_1.RectMake)(o + 2 * s, y, s, s), WindowTool_1.WindowToolType.Minimize));
        this._resizeTool = this._tools.addSubview(new WindowTool_1.WindowTool((0, functions_1.RectMake)(o + 4 * s, y, s, s), WindowTool_1.WindowToolType.Resize));
        this.applyFrame();
    }
    applyFrame() {
        this._titleView.frame = this.makeTitleViewRect();
        this._titleView.applyFrame();
        super.applyFrame();
    }
    makeTitleViewRect() {
        return (0, functions_1.RectMake)(80, 4, this.frame.size.width - 80, 20);
    }
}
exports.TitleBar = TitleBar;
