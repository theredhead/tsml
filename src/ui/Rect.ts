import { RectMake } from "./functions";
import { Point } from "./Point";
import { Size } from "./Size";

export class Rect {
  public origin: Point;
  public size: Size;

  public get center() {
    return new Point(
      this.origin.x + this.size.width / 2,
      this.origin.y + this.size.height / 2
    );
  }

  public centeredInRect(r: Rect) {}

  public shrink(pixels: number): Rect {
    return RectMake(
      this.origin.x + pixels,
      this.origin.y + pixels,
      this.size.width - 2 * pixels,
      this.size.height - 2 * pixels
    );
  }

  public copy(): Rect {
    return RectMake(
      this.origin.x,
      this.origin.y,
      this.size.width,
      this.size.height
    );
  }

  public sizeOnlyCopy(): Rect {
    return RectMake(0, 0, this.size.width, this.size.height);
  }

  public toString(): string {
    return [
      this.origin.x,
      this.origin.y,
      this.size.width,
      this.size.height,
    ].join(", ");
  }

  public isEquivalentTToRect(otherRect: Rect) {
    return this.toString() == otherRect.toString();
  }

  public intersects(other: Rect) {
    var delta = this.center.distanceTo(other.center),
      dx = Math.abs(delta.x),
      dy = Math.abs(delta.y);
    return (
      (dx < this.size.width / 2 || dx < other.size.width / 2) &&
      dy < Math.max(this.size.height / 2, other.size.height / 2)
    );
  }

  public toClipString(): string {
    return (
      "rect(0px," +
      this.size.width.toFixed(0) +
      "px," +
      this.size.height.toFixed(0) +
      "px,0px)"
    );
  }

  public adjustRectsToFitHorizontally(rects: Rect[], margin: number = 0) {
    var availableWidth = this.size.width,
      singleRectWidth =
        (availableWidth - (1 + rects.length) * margin) / rects.length,
      singleRectHeight = this.size.height - 2 * margin;

    for (var ix = 0; ix < rects.length; ix++) {
      rects[ix].origin.y = margin;
      rects[ix].origin.x = (ix + 1) * margin + ix * singleRectWidth;
      rects[ix].size.width = singleRectWidth;
      rects[ix].size.height = singleRectHeight;
    }
  }

  public adjustRectsToFitVertically(rects: Rect[], margin: number = 0) {
    var availableHeight = this.size.height,
      singleRectHeight =
        (availableHeight - (1 + rects.length) * margin) / rects.length,
      singleRectWidth = this.size.width - 2 * margin;

    for (var ix = 0; ix < rects.length; ix++) {
      rects[ix].origin.x = margin;
      rects[ix].origin.y = (ix + 1) * margin + ix * singleRectHeight;
      rects[ix].size.width = singleRectWidth;
      rects[ix].size.height = singleRectHeight;
    }
  }

  public get isNegativeRect(): boolean {
    return this.size.width < 0 || this.size.height < 0;
  }

  constructor(origin: Point, size: Size) {
    this.origin = origin;
    this.size = size;
  }
}
