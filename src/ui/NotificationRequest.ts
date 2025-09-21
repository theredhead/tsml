import { Notification } from "./Notification";

export class NotificationRequest {
  private _notificationKind: string;
  private _target: Object;
  private _action: string;

  public get notificationKind(): string {
    return this._notificationKind;
  }

  public act(notification: Notification): void {
    const func = (this._target as any)[this._action];
    if (func) {
      func.call(this._target, notification.sender);
    }
  }

  constructor(aNotificationKind: string, aTarget: Object, anAction: string) {
    this._notificationKind = aNotificationKind;
    this._target = aTarget;
    this._action = anAction;
  }
}
