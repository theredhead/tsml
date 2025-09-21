"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentView = void 0;
const View_1 = require("../View");
class ContentView extends View_1.UIView {
    constructor(aRect) {
        super(aRect);
        this.autoresizesSubviews = true;
        // console.log('Created a ContentView');
    }
}
exports.ContentView = ContentView;
