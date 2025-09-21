import { Rect } from "../Rect";
import { UIView } from "../View";

export enum WindowToolType {
  Close,
  Minimize,
  Resize,
}

export class WindowTool extends UIView {
  constructor(rect: Rect, type: WindowToolType) {
    super(rect);
    this.addCssClass(WindowToolType[type]);
    this.clipsContent = false;
  }
}
