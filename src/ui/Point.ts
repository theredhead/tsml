export class Point {
  private prep(n: number): number {
    return n;
  }

  private _x: number;
  public get x(): number {
    return this._x;
  }

  public set x(v: number) {
    this._x = this.prep(v);
  }

  private _y: number;
  public get y(): number {
    return this._y;
  }

  public set y(v: number) {
    this._y = this.prep(v);
  }

  public toString(): string {
    return "Point(" + this.x + ", " + this.y + ")";
  }

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  public distanceTo(other: Point) {
    return new Point(this.x - other.x, this.y - other.y);
  }
}
