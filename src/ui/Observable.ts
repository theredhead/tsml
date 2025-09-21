import { NotificationRequest } from "./NotificationRequest";
import { Notification } from "./Notification";
import { typeId } from "./functions";
import { PropertyWillChangeNotification } from "./PropertyWillChangeNotification";
import { PropertyDidChangeNotification } from "./PropertyDidChangeNotification";

export interface IObservable {
  registerObserver(
    notificationKind: string,
    target: Object,
    action: string
  ): void;
  notifyPropertyWillChange(propertyName: string): void;
  notifyPropertyDidChange(propertyName: string): void;
  notifyListeners(notification: Notification): void;
}

export class Observable implements IObservable {
  private _observers: NotificationRequest[];

  public registerObserver(
    notificationKind: string,
    target: Object,
    action: string
  ) {
    this._observers.push(
      new NotificationRequest(notificationKind, target, action)
    );
  }

  public notifyPropertyWillChange(propertyName: string) {
    this.notifyListeners(
      new PropertyWillChangeNotification(propertyName, this)
    );
  }

  public notifyPropertyDidChange(propertyName: string) {
    this.notifyListeners(new PropertyDidChangeNotification(propertyName, this));
  }

  public notifyListeners(notification: Notification): void {
    if (this._observers && this._observers.length) {
      for (var ix = 0; ix < this._observers.length; ix++) {
        if (typeId(this._observers[ix]) === notification.notificationKind) {
          this._observers[ix].act(notification);
        }
      }
    }
  }

  constructor() {
    this._observers = [];
  }
}
