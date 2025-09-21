"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewDragManager = void 0;
const functions_1 = require("./functions");
class ViewDragManager {
    constrainWithin(rect) {
        this.constrainTo = rect;
    }
    handleMouseMove(e) {
        var newFrame = (0, functions_1.RectMake)(e.x - this.offsetX, e.y - this.offsetY, this.view.frame.size.width, this.view.frame.size.height);
        var constrainedFrame = this.adjustToConstrainedFrame(newFrame);
        this.view.frame = constrainedFrame;
        this.view.applyFrame();
    }
    adjustToConstrainedFrame(rect) {
        if (this.constrainTo && this.constrainTo) {
            const adjusted = { ...rect };
            const cf = this.constrainTo;
            if (cf.origin.x > rect.origin.x) {
                adjusted.origin.x = rect.origin.x;
            }
            if (cf.origin.y > rect.origin.y) {
                adjusted.origin.y = rect.origin.y;
            }
            if (adjusted.origin.x + adjusted.size.width >
                cf.origin.x + cf.size.width) {
                const diffX = adjusted.origin.x +
                    adjusted.size.width -
                    (cf.origin.x + cf.size.width);
                adjusted.origin.x -= diffX;
            }
            if (adjusted.origin.y + adjusted.size.height >
                cf.origin.y + cf.size.height) {
                const diffY = adjusted.origin.x +
                    adjusted.size.height -
                    (cf.origin.x + cf.size.height);
                adjusted.origin.y -= diffY;
            }
        }
        return rect;
    }
    handleMouseRelease(e) {
        document.removeEventListener("mousemove", this.mouseMoveHandler, true);
        document.removeEventListener("mouseup", this.mouseUpHandler, true);
        this.view.isBeingDragged = false;
        this.view.applyFrame();
    }
    constructor(e, view) {
        this.constrainTo = null;
        this.view = view;
        this.view.isBeingDragged = true;
        this.offsetX = e.x - view.frame.origin.x;
        this.offsetY = e.y - view.frame.origin.y;
        this.mouseMoveHandler = (e) => {
            this.handleMouseMove(e);
        };
        this.mouseUpHandler = (e) => {
            this.handleMouseRelease(e);
        };
        document.addEventListener("mousemove", this.mouseMoveHandler, true);
        document.addEventListener("mouseup", this.mouseUpHandler, true);
    }
}
exports.ViewDragManager = ViewDragManager;
