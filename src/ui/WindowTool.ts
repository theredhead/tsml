import { UIView } from "./View";
import { Rect } from "./Rect";

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
