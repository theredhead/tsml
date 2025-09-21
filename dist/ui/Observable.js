"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observable = void 0;
const NotificationRequest_1 = require("./NotificationRequest");
const PropertyWillChangeNotification_1 = require("./PropertyWillChangeNotification");
const PropertyDidChangeNotification_1 = require("./PropertyDidChangeNotification");
const functions_1 = require("./functions");
class Observable {
    registerObserver(notificationKind, target, action) {
        this._observers.push(new NotificationRequest_1.NotificationRequest(notificationKind, target, action));
    }
    notifyPropertyWillChange(propertyName) {
        this.notifyListeners(new PropertyWillChangeNotification_1.PropertyWillChangeNotification(propertyName, this));
    }
    notifyPropertyDidChange(propertyName) {
        this.notifyListeners(new PropertyDidChangeNotification_1.PropertyDidChangeNotification(propertyName, this));
    }
    notifyListeners(notification) {
        if (this._observers && this._observers.length) {
            for (var ix = 0; ix < this._observers.length; ix++) {
                if ((0, functions_1.typeId)(this._observers[ix]) === notification.notificationKind) {
                    this._observers[ix].act(notification);
                }
            }
        }
    }
    constructor() {
        this._observers = [];
    }
}
exports.Observable = Observable;
