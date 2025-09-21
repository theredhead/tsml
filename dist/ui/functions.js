"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeId = typeId;
exports.DetermineTextSize = DetermineTextSize;
exports.PointMake = PointMake;
exports.SizeMake = SizeMake;
exports.RectMake = RectMake;
exports.RectInset = RectInset;
exports.RectOutset = RectOutset;
exports.RectMakeZero = RectMakeZero;
exports.resizeProportionally = resizeProportionally;
const Size_1 = require("./Size");
const Point_1 = require("./Point");
const Rect_1 = require("./Rect");
function typeId(anObject) {
    var matches = /function (.{1,})\(/.exec(anObject["constructor"].toString());
    return matches && matches.length > 1 ? matches[1] : "";
}
function DetermineTextSize(text, font) {
    let canvas = DetermineTextSize.canvas ||
        (DetermineTextSize.canvas = document.createElement("canvas"));
    let context = canvas.getContext("2d");
    context.font = font;
    let metrics = context.measureText(text);
    return SizeMake(metrics.width, metrics.height);
}
function PointMake(x, y) {
    return new Point_1.Point(x, y);
}
function SizeMake(width, height) {
    return new Size_1.Size(width, height);
}
function RectMake(x, y, width, height) {
    return new Rect_1.Rect(PointMake(x, y), SizeMake(width, height));
}
function RectInset(r, p) {
    return new Rect_1.Rect(PointMake(r.origin.x + p, r.origin.y + p), SizeMake(r.size.width - 2 * p, r.size.height - 2 * p));
}
function RectOutset(r, p) {
    return new Rect_1.Rect(PointMake(r.origin.x - p, r.origin.y - p), SizeMake(r.size.width + 2 * p, r.size.height + 2 * p));
}
function RectMakeZero(s) {
    if (s === undefined)
        return RectMake(0, 0, 0, 0);
    else
        return new Rect_1.Rect(new Point_1.Point(0, 0), s);
}
function resizeProportionally(r, oldSize, newSize) {
    var fn = (lengthA, lengthB, distanceA) => {
        return (distanceA * lengthB) / lengthA;
    };
    var x = fn(oldSize.width, newSize.width, r.origin.x), y = fn(oldSize.height, newSize.height, r.origin.y), w = fn(oldSize.width, newSize.width, r.size.width), h = fn(oldSize.height, newSize.height, r.size.height);
    return RectMake(x, y, w, h);
}
