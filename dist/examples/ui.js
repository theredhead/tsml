"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionButton = exports.Label = exports.VBox = void 0;
const content_decorator_js_1 = require("../content-decorator.js");
const observable_decorators_js_1 = require("../observable-decorators.js");
const observable_core_js_1 = require("../observable-core.js");
let VBox = class VBox extends observable_core_js_1.ObservableHost {
    constructor() {
        super(...arguments);
        this.spacing = 0;
        this.children = [];
    }
    add(v) {
        this.children.push(v);
    }
};
exports.VBox = VBox;
__decorate([
    (0, observable_decorators_js_1.Observable)()
], VBox.prototype, "spacing", void 0);
exports.VBox = VBox = __decorate([
    (0, content_decorator_js_1.Content)("children")
], VBox);
class Label extends observable_core_js_1.ObservableHost {
    constructor() {
        super(...arguments);
        this.text = "";
    }
}
exports.Label = Label;
__decorate([
    (0, observable_decorators_js_1.Observable)()
], Label.prototype, "text", void 0);
class ActionButton extends observable_core_js_1.ObservableHost {
    constructor(theme, analytics) {
        super();
        this.theme = theme;
        this.analytics = analytics;
        this.text = "";
    }
    click() {
        this.analytics?.track?.("click", { text: this.text });
    }
}
exports.ActionButton = ActionButton;
__decorate([
    (0, observable_decorators_js_1.Observable)()
], ActionButton.prototype, "text", void 0);
