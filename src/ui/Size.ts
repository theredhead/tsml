export class Size {
  private prep(n: number): number {
    return n;
  }

  private _width: number;
  public get width(): number {
    return this._width;
  }

  public set width(v: number) {
    this._width = this.prep(v);
  }

  private _height: number;
  public get height(): number {
    return this._height;
  }

  public set height(v: number) {
    this._height = this.prep(v);
  }

  public toString(): string {
    return "Size(" + this.width + ", " + this.height + ")";
  }

  constructor(width: number, height: number) {
    this._height = height;
    this._width = width;
  }
}
