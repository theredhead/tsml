var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Content } from "../content-decorator.js";
import { Observable } from "../observable-decorators.js";
let VBox = class VBox {
    constructor() {
        this.spacing = 0;
        this.children = [];
    }
    add(v) {
        this.children.push(v);
    }
};
__decorate([
    Observable()
], VBox.prototype, "spacing", void 0);
VBox = __decorate([
    Content("children")
], VBox);
export { VBox };
export class Label {
    constructor() {
        this.text = "";
    }
}
__decorate([
    Observable()
], Label.prototype, "text", void 0);
export class ActionButton {
    constructor(theme, analytics) {
        this.theme = theme;
        this.analytics = analytics;
        this.text = "";
    }
    click() {
        this.analytics?.track?.("click", { text: this.text });
    }
}
__decorate([
    Observable()
], ActionButton.prototype, "text", void 0);
