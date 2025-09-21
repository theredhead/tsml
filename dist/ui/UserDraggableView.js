"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDraggableView = void 0;
const UserResizableView_1 = require("./UserResizableView");
const ViewDragManager_1 = require("./ViewDragManager");
const View_1 = require("./View");
class UserDraggableView extends UserResizableView_1.UserResizableView {
    get constrainWithin() {
        return this._constrainWithin || null;
    }
    set constrainWithin(v) {
        this._constrainWithin = v;
    }
    get isDraggable() {
        return this._isDraggable && this._dragHandleView != null;
    }
    set isDraggable(v) {
        this._isDraggable = v;
    }
    get dragHandleView() {
        return this._dragHandleView || null;
    }
    set dragHandleView(v) {
        if (v != this._dragHandleView) {
            this._dragHandleView = v;
            if (this.dragHandleView instanceof View_1.UIView) {
                if (this.isDraggable) {
                    this.dragHandleView.mouseDown = (e) => {
                        var mgr = new ViewDragManager_1.ViewDragManager(e, this);
                        mgr.constrainWithin(this.constrainWithin);
                    };
                }
                else {
                    this.dragHandleView.mouseDown = (e) => { };
                }
            }
        }
    }
    constructor(aRect) {
        super(aRect);
        this._constrainWithin = null;
        this._isDraggable = false;
        this._dragHandleView = null;
    }
}
exports.UserDraggableView = UserDraggableView;
