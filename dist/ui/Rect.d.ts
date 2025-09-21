import { Point } from "./Point";
import { Size } from "./Size";
export declare class Rect {
    origin: Point;
    size: Size;
    get center(): Point;
    centeredInRect(r: Rect): void;
    shrink(pixels: number): Rect;
    copy(): Rect;
    sizeOnlyCopy(): Rect;
    toString(): string;
    isEquivalentTToRect(otherRect: Rect): boolean;
    intersects(other: Rect): boolean;
    toClipString(): string;
    adjustRectsToFitHorizontally(rects: Rect[], margin?: number): void;
    adjustRectsToFitVertically(rects: Rect[], margin?: number): void;
    get isNegativeRect(): boolean;
    constructor(origin: Point, size: Size);
}
