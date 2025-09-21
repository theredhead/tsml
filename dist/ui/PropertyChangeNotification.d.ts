import { Notification } from "./Notification";
export declare class PropertyChangeNotification extends Notification {
    private _propertyName;
    get propertyName(): string;
    constructor(propertyName: string, sender: Object);
}
