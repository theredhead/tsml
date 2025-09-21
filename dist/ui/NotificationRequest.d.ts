import { Notification } from "./Notification";
export declare class NotificationRequest {
    private _notificationKind;
    private _target;
    private _action;
    get notificationKind(): string;
    act(notification: Notification): void;
    constructor(aNotificationKind: string, aTarget: Object, anAction: string);
}
