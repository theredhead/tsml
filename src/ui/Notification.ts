import { typeId } from "./functions";

export class Notification {
  private _sender: Object;

  public get notificationKind(): string {
    return typeId(this);
  }

  public get sender() {
    return this._sender;
  }

  constructor(sender: Object) {
    this._sender = sender;
  }
}
