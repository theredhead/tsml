export declare class VBox {
    spacing: number;
    children: any[];
    add(v: any): void;
}
export declare class Label {
    text: string;
}
export declare class ActionButton {
    private theme;
    private analytics;
    text: string;
    constructor(theme: any, analytics: any);
    click(): void;
}
