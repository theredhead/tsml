"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewResizeManager = exports.Resize = void 0;
var Resize;
(function (Resize) {
    Resize[Resize["North"] = 1] = "North";
    Resize[Resize["East"] = 2] = "East";
    Resize[Resize["South"] = 4] = "South";
    Resize[Resize["West"] = 8] = "West";
})(Resize || (exports.Resize = Resize = {}));
class ViewResizeManager {
    constrain(val, min, max) {
        if (min && val < min)
            return min;
        if (max && val > max)
            return max;
        return val;
    }
    handleMouseMove(e) {
        if (this.busy)
            return;
        this.busy = true;
        e.preventDefault();
        var dir = this.resizeDirectionMask, frame = this.originalFrame.copy(), diffX = Math.round(this.initialMouseEvent.x - e.x), diffY = Math.round(this.initialMouseEvent.y - e.y);
        if ((dir & Resize.East) == Resize.East) {
            frame.size.width = Math.round(this.originalFrame.size.width - diffX);
        }
        if ((dir & Resize.West) == Resize.West) {
            frame.origin.x = Math.round(this.originalFrame.origin.x - diffX);
            frame.size.width = Math.round(this.originalFrame.size.width + diffX);
        }
        if ((dir & Resize.South) == Resize.South) {
            frame.size.height = Math.round(this.originalFrame.size.height - diffY);
        }
        if ((dir & Resize.North) == Resize.North) {
            frame.origin.y = Math.round(this.originalFrame.origin.y - diffY);
            frame.size.height = Math.round(this.originalFrame.size.height + diffY);
        }
        this.view.frame = frame;
        this.busy = false;
    }
    handleMouseRelease(e) {
        document.removeEventListener("mousemove", this.mouseMoveHandler, true);
        document.removeEventListener("mouseup", this.mouseUpHandler, true);
        this.view.isResizing = false;
        this.view.isBeingDragged = false;
        this.view.applyFrame();
    }
    constructor(e, view, directionMask) {
        this.busy = true;
        this.initialMouseEvent = e;
        this.view = view;
        this.view.isResizing = true;
        this.originalFrame = this.view.frame;
        this.resizeDirectionMask = directionMask;
        this.offsetX = e.offsetX;
        this.offsetY = e.offsetY;
        this.mouseMoveHandler = (e) => {
            this.handleMouseMove(e);
        };
        this.mouseUpHandler = (e) => {
            this.handleMouseRelease(e);
        };
        document.addEventListener("mousemove", this.mouseMoveHandler, true);
        document.addEventListener("mouseup", this.mouseUpHandler, true);
        this.busy = false;
    }
}
exports.ViewResizeManager = ViewResizeManager;
