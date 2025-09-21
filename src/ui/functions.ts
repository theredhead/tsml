import { Size } from "./Size";
import { Point } from "./Point";
import { Rect } from "./Rect";

export function typeId(anObject: Object): string {
  var matches = /function (.{1,})\(/.exec(anObject["constructor"].toString());
  return matches && matches.length > 1 ? matches[1] : "";
}

export function DetermineTextSize(text: string, font: string): Size {
  let canvas =
    (DetermineTextSize as any).canvas ||
    ((DetermineTextSize as any).canvas = document.createElement("canvas"));
  let context = canvas.getContext("2d");
  context.font = font;
  let metrics = context.measureText(text);
  return SizeMake(metrics.width, metrics.height);
}

export function PointMake(x: number, y: number): Point {
  return new Point(x, y);
}

export function SizeMake(width: number, height: number): Size {
  return new Size(width, height);
}

export function RectMake(
  x: number,
  y: number,
  width: number,
  height: number
): Rect {
  return new Rect(PointMake(x, y), SizeMake(width, height));
}

export function RectInset(r: Rect, p: number): Rect {
  return new Rect(
    PointMake(r.origin.x + p, r.origin.y + p),
    SizeMake(r.size.width - 2 * p, r.size.height - 2 * p)
  );
}

export function RectOutset(r: Rect, p: number): Rect {
  return new Rect(
    PointMake(r.origin.x - p, r.origin.y - p),
    SizeMake(r.size.width + 2 * p, r.size.height + 2 * p)
  );
}

export function RectMakeZero(s?: Size): Rect {
  if (s === undefined) return RectMake(0, 0, 0, 0);
  else return new Rect(new Point(0, 0), s);
}

export function resizeProportionally(
  r: Rect,
  oldSize: Size,
  newSize: Size
): Rect {
  var fn = (lengthA: number, lengthB: number, distanceA: number) => {
    return (distanceA * lengthB) / lengthA;
  };
  var x = fn(oldSize.width, newSize.width, r.origin.x),
    y = fn(oldSize.height, newSize.height, r.origin.y),
    w = fn(oldSize.width, newSize.width, r.size.width),
    h = fn(oldSize.height, newSize.height, r.size.height);
  return RectMake(x, y, w, h);
}
