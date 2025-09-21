import { ObservableHost } from "../observable-core.js";
export declare class VBox extends ObservableHost {
    spacing: number;
    children: any[];
    add(v: any): void;
}
export declare class Label extends ObservableHost {
    text: string;
}
export declare class ActionButton extends ObservableHost {
    private theme;
    private analytics;
    text: string;
    constructor(theme: any, analytics: any);
    click(): void;
}
