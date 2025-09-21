"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResizableView = void 0;
const View_1 = require("./View");
const WindowSizeHandle_1 = require("./window/WindowSizeHandle");
const functions_1 = require("./functions");
const ViewResizeManager_1 = require("./ViewResizeManager");
class UserResizableView extends View_1.UIView {
    get isHorizontallySizable() {
        return this._isHorizontallySizable;
    }
    set isHorizontallySizable(v) {
        this._isHorizontallySizable = v;
    }
    get isVertictallySizable() {
        return this._isVertictallySizable;
    }
    set isVertictallySizable(v) {
        this._isVertictallySizable = v;
    }
    get resizeBorderThickness() {
        return Math.round(this._resizeBorderThickness);
    }
    set resizeBorderThickness(v) {
        this._resizeBorderThickness = v;
    }
    constructor(aRect) {
        super(aRect);
        this._isHorizontallySizable = true;
        this._isVertictallySizable = true;
        this._resizeBorderThickness = 4;
        var thickness = this._resizeBorderThickness;
        this._sizeHandleTopLeft = this.addSubview(new WindowSizeHandle_1.WindowSizeHandle((0, functions_1.RectMake)(0, 0, thickness, thickness)));
        this._sizeHandleTopLeft.setCursor("nw-resize");
        this._sizeHandleTopRight = this.addSubview(new WindowSizeHandle_1.WindowSizeHandle((0, functions_1.RectMake)(aRect.size.width - thickness, 0, thickness, thickness)));
        this._sizeHandleTopRight.setCursor("ne-resize");
        this._sizeHandleBottomLeft = this.addSubview(new WindowSizeHandle_1.WindowSizeHandle((0, functions_1.RectMake)(0, aRect.size.height - thickness, thickness, thickness)));
        this._sizeHandleBottomLeft.setCursor("sw-resize");
        this._sizeHandleBottomRight = this.addSubview(new WindowSizeHandle_1.WindowSizeHandle((0, functions_1.RectMake)(aRect.size.width - thickness, aRect.size.height - thickness, thickness, thickness)));
        this._sizeHandleBottomRight.setCursor("se-resize");
        this._sizeHandleHorizontallyLeft = this.addSubview(new WindowSizeHandle_1.WindowSizeHandle((0, functions_1.RectMake)(0, thickness, thickness, aRect.size.height - 2 * thickness)));
        this._sizeHandleHorizontallyLeft.setCursor("w-resize");
        this._sizeHandleHorizontallyRight = this.addSubview(new WindowSizeHandle_1.WindowSizeHandle((0, functions_1.RectMake)(aRect.size.width - thickness, thickness, thickness, aRect.size.height - 2 * thickness)));
        this._sizeHandleHorizontallyRight.setCursor("e-resize");
        this._sizeHandleVerticallyTop = this.addSubview(new WindowSizeHandle_1.WindowSizeHandle((0, functions_1.RectMake)(thickness, 0, aRect.size.width - 2 * thickness, thickness)));
        this._sizeHandleVerticallyTop.setCursor("n-resize");
        this._sizeHandleVerticallyallyBottom = this.addSubview(new WindowSizeHandle_1.WindowSizeHandle((0, functions_1.RectMake)(thickness, aRect.size.height - thickness, aRect.size.width - 2 * thickness, thickness)));
        this._sizeHandleVerticallyallyBottom.setCursor("s-resize");
        // this.applyFrame();
        var theView = this;
        this._sizeHandleHorizontallyRight.mouseDown = (e) => {
            if (!theView.isResizing && theView.isHorizontallySizable) {
                new ViewResizeManager_1.ViewResizeManager(e, theView, ViewResizeManager_1.Resize.East);
            }
        };
        this._sizeHandleHorizontallyLeft.mouseDown = (e) => {
            if (!theView.isResizing && theView.isHorizontallySizable) {
                new ViewResizeManager_1.ViewResizeManager(e, theView, ViewResizeManager_1.Resize.West);
            }
        };
        this._sizeHandleVerticallyTop.mouseDown = (e) => {
            if (!theView.isResizing && theView.isVertictallySizable) {
                new ViewResizeManager_1.ViewResizeManager(e, theView, ViewResizeManager_1.Resize.North);
            }
        };
        this._sizeHandleVerticallyallyBottom.mouseDown = (e) => {
            if (!theView.isResizing && theView.isVertictallySizable) {
                new ViewResizeManager_1.ViewResizeManager(e, theView, ViewResizeManager_1.Resize.South);
            }
        };
        this._sizeHandleTopLeft.mouseDown = (e) => {
            if (!theView.isResizing &&
                theView.isVertictallySizable &&
                theView.isHorizontallySizable) {
                new ViewResizeManager_1.ViewResizeManager(e, theView, ViewResizeManager_1.Resize.North | ViewResizeManager_1.Resize.West);
            }
        };
        this._sizeHandleTopRight.mouseDown = (e) => {
            if (!theView.isResizing &&
                theView.isVertictallySizable &&
                theView.isHorizontallySizable) {
                new ViewResizeManager_1.ViewResizeManager(e, theView, ViewResizeManager_1.Resize.North | ViewResizeManager_1.Resize.East);
            }
        };
        this._sizeHandleBottomLeft.mouseDown = (e) => {
            if (!theView.isResizing &&
                theView.isVertictallySizable &&
                theView.isHorizontallySizable) {
                new ViewResizeManager_1.ViewResizeManager(e, theView, ViewResizeManager_1.Resize.South | ViewResizeManager_1.Resize.West);
            }
        };
        this._sizeHandleBottomRight.mouseDown = (e) => {
            if (!theView.isResizing &&
                theView.isVertictallySizable &&
                theView.isHorizontallySizable) {
                new ViewResizeManager_1.ViewResizeManager(e, theView, ViewResizeManager_1.Resize.South | ViewResizeManager_1.Resize.East);
            }
        };
        this.isHorizontallySizable = true;
        this.isVertictallySizable = true;
    }
    applyFrame() {
        let thickness = this.resizeBorderThickness;
        this._sizeHandleTopLeft.frame = (0, functions_1.RectMake)(0, 0, thickness, thickness);
        this._sizeHandleTopRight.frame = (0, functions_1.RectMake)(this.frame.size.width - thickness, 0, thickness, thickness);
        this._sizeHandleBottomLeft.frame = (0, functions_1.RectMake)(0, this.frame.size.height - thickness, thickness, thickness);
        this._sizeHandleBottomRight.frame = (0, functions_1.RectMake)(this.frame.size.width - thickness, this.frame.size.height - thickness, thickness, thickness);
        this._sizeHandleHorizontallyLeft.frame = (0, functions_1.RectMake)(0, thickness, thickness, this.frame.size.height - 2 * thickness);
        this._sizeHandleHorizontallyRight.frame = (0, functions_1.RectMake)(this.frame.size.width - thickness, thickness, thickness, this.frame.size.height - 2 * thickness);
        this._sizeHandleVerticallyTop.frame = (0, functions_1.RectMake)(thickness, 0, this.frame.size.width - 2 * thickness, thickness);
        this._sizeHandleVerticallyallyBottom.frame = (0, functions_1.RectMake)(thickness, this.frame.size.height - thickness, this.frame.size.width - 2 * thickness, thickness);
        super.applyFrame();
    }
}
exports.UserResizableView = UserResizableView;
