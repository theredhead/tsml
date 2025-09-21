import { Notification } from "./Notification";
export declare class Observable {
    private _observers;
    registerObserver(notificationKind: string, target: Object, action: string): void;
    notifyPropertyWillChange(propertyName: string): void;
    notifyPropertyDidChange(propertyName: string): void;
    notifyListeners(notification: Notification): void;
    constructor();
}
