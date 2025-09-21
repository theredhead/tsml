import { UIWindow } from "../window";
import { UIView } from "../View";
export declare class DockView extends UIView {
    constructor(parentView: UIView);
    present(windows: UIWindow[]): void;
    private represent;
}
