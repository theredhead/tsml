"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Size = void 0;
class Size {
    prep(n) {
        return n;
    }
    get width() {
        return this._width;
    }
    set width(v) {
        this._width = this.prep(v);
    }
    get height() {
        return this._height;
    }
    set height(v) {
        this._height = this.prep(v);
    }
    toString() {
        return "Size(" + this.width + ", " + this.height + ")";
    }
    constructor(width, height) {
        this._height = height;
        this._width = width;
    }
}
exports.Size = Size;
