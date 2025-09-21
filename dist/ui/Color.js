"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colors = exports.Color = void 0;
class Color {
    adjustToByte(i) {
        var o = Math.ceil(i);
        if (o < 0) {
            return 0;
        }
        else if (o > 255) {
            return 255;
        }
        else
            return o;
    }
    adjustAlpha(i) {
        if (i < 0) {
            return 0;
        }
        else if (i > 1) {
            return 1;
        }
        else
            return i;
    }
    constructor(r, g, b, alpha = 1.0) {
        this._r = this.adjustToByte(r);
        this._g = this.adjustToByte(g);
        this._b = this.adjustToByte(b);
        this._alpha = this.adjustAlpha(alpha);
    }
    toString() {
        const result = "rgba(" +
            [
                this._r.toFixed(0),
                this._g.toFixed(0),
                this._b.toFixed(0),
                this._alpha,
            ].join(", ") +
            ")";
        return result;
    }
}
exports.Color = Color;
exports.colors = {
    white: new Color(255, 255, 255),
    lightGray: new Color(196, 196, 196),
    gray: new Color(127, 127, 127),
    darkGray: new Color(64, 64, 64),
    black: new Color(0, 0, 0),
    red: new Color(255, 0, 0),
    green: new Color(0, 255, 0),
    blue: new Color(0, 0, 255),
    darkRed: new Color(127, 0, 0),
    darkGreen: new Color(0, 127, 0),
    darkBlue: new Color(0, 0, 127),
};
