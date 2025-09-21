export declare class Color {
    private _r;
    private _g;
    private _b;
    private _alpha;
    private adjustToByte;
    private adjustAlpha;
    constructor(r: number, g: number, b: number, alpha?: number);
    toString(): string;
}
export declare const colors: {
    white: Color;
    lightGray: Color;
    gray: Color;
    darkGray: Color;
    black: Color;
    red: Color;
    green: Color;
    blue: Color;
    darkRed: Color;
    darkGreen: Color;
    darkBlue: Color;
};
