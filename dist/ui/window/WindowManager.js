"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowManager = void 0;
const DockView_1 = require("../dock/DockView");
class WindowManager {
    get windows() {
        return this._windows;
    }
    addWindow(window) {
        if (window == null) {
            throw new Error("Window cannot be null.");
        }
        if (window.element == null) {
            throw new Error("Window hasn't created its element yet.");
        }
        window.windowManager = this;
        this._windows.push(window);
        window.parentView = this._container;
        //window._windowManager = this._container;
        if (window.element.parentNode == null) {
            this._container.element.appendChild(window.element);
        }
        else {
            window.element.parentNode.removeChild(window.element);
            this._container.element.appendChild(window.element);
        }
        this._dock.present(this._windows);
    }
    orderFront(window) {
        var oldFront, newFront;
        if (window == null) {
            throw new Error("Cannot add null window");
        }
        if (window.element == null) {
            throw new Error("Cannot add window that hasn't created its element yet.");
        }
        if (window.element.parentNode == null) {
            this._container.element.appendChild(window.element);
        }
        window.visible = true;
        if (window === this._front)
            return;
        for (var ix = 0; ix < this._windows.length; ix++) {
            if (this._windows[ix] === window) {
                newFront = this._windows[ix];
                continue;
            }
            else if (this._windows[ix] === this._front) {
                oldFront = this._windows[ix];
                continue;
            }
        }
        if (oldFront) {
            oldFront.removeCssClass("front");
        }
        if (newFront) {
            var container = newFront.element.parentNode;
            if (container) {
                container.removeChild(newFront.element);
                container.appendChild(newFront.element);
                newFront.applyFrame();
            }
            newFront.addCssClass("front");
        }
        this._front = window;
    }
    constructor(container) {
        this._windows = [];
        this._container = container;
        this._dock = new DockView_1.DockView(this._container);
    }
}
exports.WindowManager = WindowManager;
