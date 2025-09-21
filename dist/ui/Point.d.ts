export declare class Point {
    private prep;
    private _x;
    get x(): number;
    set x(v: number);
    private _y;
    get y(): number;
    set y(v: number);
    toString(): string;
    constructor(x: number, y: number);
    distanceTo(other: Point): Point;
}
