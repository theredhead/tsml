"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRequest = void 0;
class NotificationRequest {
    get notificationKind() {
        return this._notificationKind;
    }
    act(notification) {
        const func = this._target[this._action];
        if (func) {
            func.call(this._target, notification.sender);
        }
    }
    constructor(aNotificationKind, aTarget, anAction) {
        this._notificationKind = aNotificationKind;
        this._target = aTarget;
        this._action = anAction;
    }
}
exports.NotificationRequest = NotificationRequest;
