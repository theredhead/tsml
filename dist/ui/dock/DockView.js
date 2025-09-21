"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockView = void 0;
const Color_1 = require("../Color");
const functions_1 = require("../functions");
const View_1 = require("../View");
class DockView extends View_1.UIView {
    constructor(parentView) {
        super(parentView.frame);
        this.parentView = parentView;
        const height = 48;
        const top = window.innerHeight - height;
        const width = window.innerWidth;
        super((0, functions_1.RectMake)(0, top, width, height));
        this.setBackgroundColor(Color_1.colors.green);
    }
    present(windows) {
        while (this.subViews.pop()) { }
        for (let window of windows) {
            let representation = this.represent(window);
            representation.applyFrame();
            this.subViews.push(representation);
        }
    }
    represent(window) {
        const view = new View_1.UIView((0, functions_1.RectMake)(0, 0, 48, 48));
        view.setBackgroundColor(Color_1.colors.blue);
        view.addCssClass("border");
        return view;
    }
}
exports.DockView = DockView;
