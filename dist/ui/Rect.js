"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rect = void 0;
const functions_1 = require("./functions");
const Point_1 = require("./Point");
class Rect {
    get center() {
        return new Point_1.Point(this.origin.x + this.size.width / 2, this.origin.y + this.size.height / 2);
    }
    centeredInRect(r) { }
    shrink(pixels) {
        return (0, functions_1.RectMake)(this.origin.x + pixels, this.origin.y + pixels, this.size.width - 2 * pixels, this.size.height - 2 * pixels);
    }
    copy() {
        return (0, functions_1.RectMake)(this.origin.x, this.origin.y, this.size.width, this.size.height);
    }
    sizeOnlyCopy() {
        return (0, functions_1.RectMake)(0, 0, this.size.width, this.size.height);
    }
    toString() {
        return [
            this.origin.x,
            this.origin.y,
            this.size.width,
            this.size.height,
        ].join(", ");
    }
    isEquivalentTToRect(otherRect) {
        return this.toString() == otherRect.toString();
    }
    intersects(other) {
        var delta = this.center.distanceTo(other.center), dx = Math.abs(delta.x), dy = Math.abs(delta.y);
        return ((dx < this.size.width / 2 || dx < other.size.width / 2) &&
            dy < Math.max(this.size.height / 2, other.size.height / 2));
    }
    toClipString() {
        return ("rect(0px," +
            this.size.width.toFixed(0) +
            "px," +
            this.size.height.toFixed(0) +
            "px,0px)");
    }
    adjustRectsToFitHorizontally(rects, margin = 0) {
        var availableWidth = this.size.width, singleRectWidth = (availableWidth - (1 + rects.length) * margin) / rects.length, singleRectHeight = this.size.height - 2 * margin;
        for (var ix = 0; ix < rects.length; ix++) {
            rects[ix].origin.y = margin;
            rects[ix].origin.x = (ix + 1) * margin + ix * singleRectWidth;
            rects[ix].size.width = singleRectWidth;
            rects[ix].size.height = singleRectHeight;
        }
    }
    adjustRectsToFitVertically(rects, margin = 0) {
        var availableHeight = this.size.height, singleRectHeight = (availableHeight - (1 + rects.length) * margin) / rects.length, singleRectWidth = this.size.width - 2 * margin;
        for (var ix = 0; ix < rects.length; ix++) {
            rects[ix].origin.x = margin;
            rects[ix].origin.y = (ix + 1) * margin + ix * singleRectHeight;
            rects[ix].size.width = singleRectWidth;
            rects[ix].size.height = singleRectHeight;
        }
    }
    get isNegativeRect() {
        return this.size.width < 0 || this.size.height < 0;
    }
    constructor(origin, size) {
        this.origin = origin;
        this.size = size;
    }
}
exports.Rect = Rect;
