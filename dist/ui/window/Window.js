"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIWindow = exports.WindowMinimizeReason = exports.WindowCloseReason = void 0;
const ContentView_1 = require("../ContentView");
const functions_1 = require("../functions");
const TitleBar_1 = require("../TitleBar");
const UserDraggableView_1 = require("../UserDraggableView");
const View_1 = require("../View");
var WindowCloseReason;
(function (WindowCloseReason) {
    WindowCloseReason[WindowCloseReason["UserAction"] = 0] = "UserAction";
})(WindowCloseReason || (exports.WindowCloseReason = WindowCloseReason = {}));
var WindowMinimizeReason;
(function (WindowMinimizeReason) {
    WindowMinimizeReason[WindowMinimizeReason["UserAction"] = 0] = "UserAction";
})(WindowMinimizeReason || (exports.WindowMinimizeReason = WindowMinimizeReason = {}));
class UIWindow extends UserDraggableView_1.UserDraggableView {
    get delegate() {
        return this._delegate;
    }
    set delegate(d) {
        this._delegate = d;
    }
    get title() {
        return this._titleBar.title;
    }
    set title(value) {
        this._titleBar.title = value;
    }
    get contentView() {
        return this._contentView;
    }
    set windowManager(mgr) {
        this._windowManager = mgr;
    }
    orderFront() {
        this.visible = false;
        this._windowManager?.orderFront(this);
    }
    init() {
        this.addCssClass("Window");
        this.minimumSize = (0, functions_1.SizeMake)(64, 64);
        this.clipsContent = false;
        this._canBecomeKey = true;
        this.isDraggable = true;
        this.dragHandleView = this._titleBar;
        this.addSubview(this._titleBar);
        var m = this.resizeBorderThickness;
        this._contentView = this.addSubview(new ContentView_1.ContentView((0, functions_1.RectMake)(m, this._titleBar.frame.size.height, this.frame.size.width - m * 2, this.frame.size.height - this._titleBar.frame.size.height - m)));
        this.allowDragAndDrop = true;
    }
    constructor(aRect = null) {
        super((aRect = aRect || (0, functions_1.RectMake)(0, 0, 329, 200)));
        this._contentView = new View_1.UIView((0, functions_1.RectMake)(0, 0, 100, 100));
        this._windowManager = undefined;
        this._canBecomeKey = false;
        this.init();
        this._titleBar = new TitleBar_1.TitleBar((0, functions_1.RectMake)(this.resizeBorderThickness, this.resizeBorderThickness, this.frame.size.width - 2 * this.resizeBorderThickness, this.resizeBorderThickness + 26));
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
    close(reason = WindowCloseReason.UserAction) {
        if (this.windowShouldClose(reason)) {
            this.windowWillClose();
            this.parentView?.removeSubview(this);
            this.windowDidClose();
        }
    }
    windowShouldClose(reason) {
        if (this.delegate) {
            let fn = this.delegate.windowShouldClose;
            if (typeof fn == "function") {
                return fn.call(this.delegate, this, reason);
            }
        }
        return true;
    }
    windowWillClose() {
        if (this.delegate) {
            let fn = this.delegate.windowDidClose;
            if (typeof fn == "function") {
                return fn.call(this.delegate, this);
            }
        }
    }
    windowDidClose() {
        if (this.delegate) {
            let fn = this.delegate.windowDidClose;
            if (typeof fn == "function") {
                return fn.call(this.delegate, this);
            }
        }
    }
    minimize(reason = WindowMinimizeReason.UserAction) {
        if (this.windowShouldMinimize(reason)) {
            this.windowWillMinimize();
            // this.parentView.removeSubview(this);
            this.visible = false;
            this.windowDidMinimize();
        }
    }
    windowShouldMinimize(reason) {
        if (this.delegate) {
            let fn = this.delegate.windowShouldMinimize;
            if (typeof fn == "function") {
                return fn.call(this.delegate, this, reason);
            }
        }
        return true;
    }
    windowWillMinimize() {
        if (this.delegate) {
            let fn = this.delegate.windowWillMinimize;
            if (typeof fn == "function") {
                return fn.call(this.delegate, this);
            }
        }
    }
    windowDidMinimize() {
        if (this.delegate) {
            let fn = this.delegate.windowDidMinimize;
            if (typeof fn == "function") {
                return fn.call(this.delegate, this);
            }
        }
    }
    unminimize(reason = WindowMinimizeReason.UserAction) {
        if (this.windowShouldUnMinimize(reason)) {
            this.windowWillUnMinimize();
            //this.parentView.removeSubview(this);
            this.windowDidUnMinimize();
        }
    }
    windowShouldUnMinimize(reason) {
        if (this.delegate) {
            let fn = this.delegate.windowShouldUnMinimize;
            if (typeof fn == "function") {
                return fn.call(this.delegate, this, reason);
            }
        }
        return true;
    }
    windowWillUnMinimize() {
        if (this.delegate) {
            let fn = this.delegate.windowWillUnMinimize;
            if (typeof fn == "function") {
                fn.call(this.delegate, this);
            }
        }
    }
    windowDidUnMinimize() {
        if (this.delegate) {
            let fn = this.delegate.windowDidUnMinimize;
            if (typeof fn == "function") {
                fn.call(this.delegate, this);
            }
        }
    }
    setupWindow() { }
    applyFrame() {
        super.applyFrame();
        this._titleBar.frame = (0, functions_1.RectMake)(this.resizeBorderThickness, this.resizeBorderThickness, this.frame.size.width - 2 * this.resizeBorderThickness, this.resizeBorderThickness + 26);
        let m = this.resizeBorderThickness;
        this._contentView.frame = (0, functions_1.RectMake)(m, this._titleBar.frame.size.height, this.frame.size.width - m * 2, this.frame.size.height - this._titleBar.frame.size.height - m);
    }
    mouseDown(e) {
        this.orderFront();
    }
    mouseUp(e) { }
    keyDown(e) { }
    keyUp(e) { }
}
exports.UIWindow = UIWindow;
