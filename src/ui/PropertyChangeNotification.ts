import { Notification } from "./Notification";

export class PropertyChangeNotification extends Notification {
  private _propertyName: string;
  get propertyName(): string {
    return this._propertyName;
  }

  constructor(propertyName: string, sender: Object) {
    super(sender);
    this._propertyName = propertyName;
  }
}
