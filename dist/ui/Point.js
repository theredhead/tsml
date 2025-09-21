"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
class Point {
    prep(n) {
        return n;
    }
    get x() {
        return this._x;
    }
    set x(v) {
        this._x = this.prep(v);
    }
    get y() {
        return this._y;
    }
    set y(v) {
        this._y = this.prep(v);
    }
    toString() {
        return "Point(" + this.x + ", " + this.y + ")";
    }
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }
    distanceTo(other) {
        return new Point(this.x - other.x, this.y - other.y);
    }
}
exports.Point = Point;
