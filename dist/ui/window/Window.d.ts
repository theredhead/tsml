import { Rect } from "../Rect";
import { UserDraggableView } from "../UserDraggableView";
import { UIView } from "../View";
import { WindowManager } from "./WindowManager";
export declare enum WindowCloseReason {
    UserAction = 0
}
export declare enum WindowMinimizeReason {
    UserAction = 0
}
export declare class UIWindow extends UserDraggableView {
    private _delegate;
    get delegate(): any;
    set delegate(d: any);
    get title(): string;
    set title(value: string);
    private _titleBar;
    private _contentView;
    get contentView(): UIView;
    private _windowManager;
    set windowManager(mgr: WindowManager | undefined);
    private _canBecomeKey;
    private unminimizedElement;
    orderFront(): void;
    init(): void;
    constructor(aRect?: Rect | null);
    close(reason?: WindowCloseReason): void;
    windowShouldClose(reason: WindowCloseReason): boolean;
    windowWillClose(): any;
    windowDidClose(): any;
    minimize(reason?: WindowMinimizeReason): void;
    windowShouldMinimize(reason: WindowMinimizeReason): boolean;
    windowWillMinimize(): any;
    windowDidMinimize(): any;
    unminimize(reason?: WindowMinimizeReason): void;
    windowShouldUnMinimize(reason: WindowMinimizeReason): boolean;
    windowWillUnMinimize(): void;
    windowDidUnMinimize(): void;
    setupWindow(): void;
    applyFrame(): void;
    mouseDown(e: MouseEvent): void;
    mouseUp(e: MouseEvent): void;
    keyDown(e: KeyboardEvent): void;
    keyUp(e: KeyboardEvent): void;
}
