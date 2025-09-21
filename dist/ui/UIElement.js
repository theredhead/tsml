"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIElement = void 0;
const functions_1 = require("./functions");
const settings_1 = require("./settings");
class UIElement {
    get visible() {
        return this._visible;
    }
    set visible(v) {
        if (this._visible != v) {
            this._visible = v;
            this.element.style.visibility = this._visible ? "visible" : "hidden";
        }
    }
    setCursor(crsr) {
        this._cursor = crsr;
        this.applyFrame();
    }
    setColor(color) {
        this._color = color;
        this.applyFrame();
    }
    setBackgroundColor(color) {
        this._backgroundColor = color;
        this.applyFrame();
    }
    setBackgroundImage(anImageUrl) {
        this._backgroundImage = anImageUrl;
        this.applyFrame();
    }
    get clipsContent() {
        return this._clipsContent;
    }
    set clipsContent(v) {
        this._clipsContent = v;
    }
    get frame() {
        return this._frame;
    }
    set frame(v) {
        if (!this._frame.isEquivalentTToRect(v)) {
            var oldFrame = this._frame;
            this.willUpdateFrame(oldFrame, v);
            this._frame = v;
            this.didUpdateFrame(oldFrame, v);
            this.applyFrame();
        }
    }
    willUpdateFrame(oldFrame, newFrame) { }
    didUpdateFrame(oldFrame, newFrame) { }
    get element() {
        return this._element;
    }
    get tagName() {
        return this._tagName;
    }
    constructor(frame) {
        this._visible = true;
        this._clipsContent = true;
        this._tagName = "div";
        this._cssClasses = [];
        this.addCssClass("ui");
        this.addCssClass((0, functions_1.typeId)(this));
        this._frame = frame;
        this._element = document.createElement(this.tagName);
        //this.applyFrame();
    }
    applyFrame() {
        this._element.style.position = "absolute";
        this._element.style.display = "block";
        this._element.style.top = this.frame.origin.y + "px";
        this._element.style.left = this.frame.origin.x + "px";
        this._element.style.height = this.frame.size.height + "px";
        this._element.style.width = this.frame.size.width + "px";
        if (this._cssClasses.length > 0)
            this._element.setAttribute("class", this.cssCasses.join(" "));
        else
            this._element.removeAttribute("class");
        if (this._cursor)
            this.element.style.cursor = this._cursor;
        if (this._backgroundColor)
            this.element.style.backgroundColor = this._backgroundColor.toString();
        if (this._backgroundImage)
            this.element.style.background = "url(" + this._backgroundImage + ")";
        if (this.clipsContent)
            this._element.style.clip = this.frame.toClipString();
        else
            this._element.style.clip = "";
        if (this._backgroundColor) {
            this._element.style.backgroundColor = this._backgroundColor.toString();
        }
        if (this._color) {
            this._element.style.color = this._color.toString();
        }
        if (this._visible)
            this._element.style.visibility = "visible";
        else
            this._element.style.visibility = "hidden";
        if (settings_1.settings.debug && settings_1.settings.displayRectInfo) {
            this.element.title = this.frame.toString();
        }
    }
    get cssCasses() {
        return this._cssClasses;
    }
    hasCssClass(aClass) {
        return this._cssClasses.indexOf(aClass) > -1;
    }
    addCssClass(aClass) {
        if (!this.hasCssClass(aClass)) {
            this._cssClasses.push(aClass);
        }
    }
    removeCssClass(aClass) {
        if (!this.hasCssClass(aClass)) {
            console.log("before removeClass:", this.cssCasses);
            this._cssClasses.splice(this._cssClasses.indexOf(aClass));
            console.log("after removeClass:", this.cssCasses);
        }
    }
    toggleCssClass(aClass) {
        if (!this.hasCssClass(aClass)) {
            this.removeCssClass(aClass);
        }
        else {
            this.addCssClass(aClass);
        }
    }
}
exports.UIElement = UIElement;
