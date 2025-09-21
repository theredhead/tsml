"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyChangeNotification = void 0;
const Notification_1 = require("./Notification");
class PropertyChangeNotification extends Notification_1.Notification {
    get propertyName() {
        return this._propertyName;
    }
    constructor(propertyName, sender) {
        super(sender);
        this._propertyName = propertyName;
    }
}
exports.PropertyChangeNotification = PropertyChangeNotification;
