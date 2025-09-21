"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIView = exports.ResizeWithParent = exports.AutoresizingMask = void 0;
const UIElement_1 = require("./UIElement");
const functions_1 = require("./functions");
var AutoresizingMask;
(function (AutoresizingMask) {
    AutoresizingMask[AutoresizingMask["LockedTop"] = 1] = "LockedTop";
    AutoresizingMask[AutoresizingMask["LockedLeft"] = 2] = "LockedLeft";
    AutoresizingMask[AutoresizingMask["LockedBottom"] = 4] = "LockedBottom";
    AutoresizingMask[AutoresizingMask["LockedRight"] = 8] = "LockedRight";
    AutoresizingMask[AutoresizingMask["WidthSizable"] = 16] = "WidthSizable";
    AutoresizingMask[AutoresizingMask["HeightSizable"] = 32] = "HeightSizable";
})(AutoresizingMask || (exports.AutoresizingMask = AutoresizingMask = {}));
exports.ResizeWithParent = AutoresizingMask.HeightSizable |
    AutoresizingMask.WidthSizable |
    AutoresizingMask.LockedLeft |
    AutoresizingMask.LockedRight |
    AutoresizingMask.LockedTop |
    AutoresizingMask.LockedBottom;
var viewId = 0;
class UIView extends UIElement_1.UIElement {
    get frame() {
        return this._frame;
    }
    set frame(v) {
        if (!this._frame.isEquivalentTToRect(v) && !v.isNegativeRect) {
            let oldFrame = this._frame;
            this.willUpdateFrame(oldFrame, v);
            this._frame = v;
            this.applyFrame();
            this.didUpdateFrame(oldFrame, v);
        }
    }
    get minimumWidth() {
        if (this.minimumSize) {
            return this.minimumSize.width;
        }
        return 0;
    }
    get minimumHeight() {
        if (this.minimumSize) {
            return this.minimumSize.height;
        }
        return 0;
    }
    get maximumWidth() {
        if (this.maximumSize) {
            return this.maximumSize.width;
        }
        return window.innerWidth;
    }
    get maximumHeight() {
        if (this.maximumSize) {
            return this.maximumSize.height;
        }
        return window.innerHeight;
    }
    get minimumSize() {
        return this._minimumSize;
    }
    set minimumSize(v) {
        this._minimumSize = v;
    }
    get maximumSize() {
        return this._maximumSize;
    }
    set maximumSize(v) {
        this._maximumSize = v;
    }
    get identifier() {
        return this._identifier;
    }
    set identifier(v) {
        this._identifier = v;
    }
    toString() {
        return this.identifier;
    }
    get parentView() {
        return this._parentView;
    }
    set parentView(aView) {
        this._parentView = aView;
    }
    get autoresizingMask() {
        return this._autoresizingMask;
    }
    set autoresizingMask(v) {
        if ((this._autoresizingMask = v)) {
            this._autoresizingMask = v;
        }
    }
    get autoresizesSubviews() {
        return this._autoresizesSubviews;
    }
    set autoresizesSubviews(v) {
        this._autoresizesSubviews = v;
    }
    willUpdateFrame(oldFrame, newFrame) {
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
    didUpdateFrame(oldFrame, newFrame) {
        // console.log(this.identifier + ' updated frame from ' + oldFrame + ' to ' + newFrame);
    }
    removeAllSubviews() {
        const old = this._subViews;
        this._subViews = [];
        return old;
    }
    resizeSubviews(oldSize, newSize) {
        if (oldSize != null) {
            if (this.autoresizesSubviews) {
                var oldRect = (0, functions_1.RectMake)(0, 0, oldSize.width, oldSize.height);
                for (var ix = 0; ix < this._subViews.length; ix++) {
                    var sub = this._subViews[ix], frame = sub.frame.copy(), rect = (0, functions_1.resizeProportionally)(sub.frame, oldSize, newSize);
                    if ((sub.autoresizingMask & AutoresizingMask.LockedLeft) ==
                        AutoresizingMask.LockedLeft) {
                        rect.origin.x = sub.frame.origin.x;
                    }
                    if ((sub.autoresizingMask & AutoresizingMask.LockedTop) ==
                        AutoresizingMask.LockedTop) {
                        rect.origin.y = sub.frame.origin.y;
                    }
                    if ((sub.autoresizingMask & AutoresizingMask.LockedRight) ==
                        AutoresizingMask.LockedRight) {
                        var distanceFromOldRight = oldSize.width - (frame.size.width + frame.origin.x);
                        rect.size.width =
                            newSize.width - rect.origin.x - distanceFromOldRight;
                    }
                    if ((sub.autoresizingMask & AutoresizingMask.LockedBottom) ==
                        AutoresizingMask.LockedBottom) {
                        var distanceFromOldBottom = oldSize.height - (frame.size.height + frame.origin.y);
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
    applyFrame() {
        for (let ix = 0; ix < this._subViews.length; ix++) {
            let view = this._subViews[ix];
            view.applyFrame();
        }
        super.applyFrame();
    }
    get isResizing() {
        return this._isResizing;
    }
    set isResizing(v) {
        ``;
        this._isResizing = v;
    }
    get isBeingDragged() {
        return this._isBeingDragged;
    }
    set isBeingDragged(v) {
        this._isBeingDragged = v;
    }
    get allowDragAndDrop() {
        return this._allowDragAndDrop;
    }
    set allowDragAndDrop(v) {
        this._allowDragAndDrop = v;
    }
    get subViews() {
        return this._subViews;
    }
    addSubview(aView) {
        this._subViews.push(aView);
        aView._parentView = this;
        this.element.appendChild(aView.element);
        return aView;
    }
    removeSubview(aView) {
        this._subViews.splice(this._subViews.indexOf(aView));
        if (this.element.contains(aView.element)) {
            this.element.removeChild(aView.element);
        }
        return aView;
    }
    center(inRect = null) {
        var parentFrame = inRect ?? this._parentView.frame, myFrame = this.frame, offsetX = parentFrame.size.width / 2 - myFrame.size.width / 2, offsetY = parentFrame.size.height / 2 - myFrame.size.height / 2;
        this.frame.origin = (0, functions_1.PointMake)(offsetX, offsetY);
        this.applyFrame();
    }
    constructor(frame) {
        super(frame);
        this._autoresizingMask = AutoresizingMask.LockedTop | AutoresizingMask.LockedLeft;
        this._autoresizesSubviews = true;
        this._allowDragAndDrop = false;
        this._subViews = [];
        let typeName = (0, functions_1.typeId)(this);
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
    mouseDown(e) { }
    mouseUp(e) { }
    draw() {
        this.applyFrame();
        //this.applyFrame();
    }
}
exports.UIView = UIView;
