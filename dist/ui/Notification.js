"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const functions_1 = require("./functions");
class Notification {
    get notificationKind() {
        return (0, functions_1.typeId)(this);
    }
    get sender() {
        return this._sender;
    }
    constructor(sender) {
        this._sender = sender;
    }
}
exports.Notification = Notification;
