"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowTool = exports.WindowToolType = void 0;
const View_1 = require("../View");
var WindowToolType;
(function (WindowToolType) {
    WindowToolType[WindowToolType["Close"] = 0] = "Close";
    WindowToolType[WindowToolType["Minimize"] = 1] = "Minimize";
    WindowToolType[WindowToolType["Resize"] = 2] = "Resize";
})(WindowToolType || (exports.WindowToolType = WindowToolType = {}));
class WindowTool extends View_1.UIView {
    constructor(rect, type) {
        super(rect);
        this.addCssClass(WindowToolType[type]);
        this.clipsContent = false;
    }
}
exports.WindowTool = WindowTool;
