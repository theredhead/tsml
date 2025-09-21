import { UIWindow } from "../window";
import { colors } from "../Color";
import { RectMake } from "../functions";
import { UIView } from "../View";

export class DockView extends UIView {
  constructor(parentView: UIView) {
    super(parentView.frame);
    this.parentView = parentView;
    const height = 48;
    const top = window.innerHeight - height;
    const width = window.innerWidth;
    super(RectMake(0, top, width, height));
    this.setBackgroundColor(colors.green);
  }

  public present(windows: UIWindow[]): void {
    while (this.subViews.pop()) {}

    for (let window of windows) {
      let representation = this.represent(window);
      representation.applyFrame();
      this.subViews.push(representation);
    }
  }

  private represent(window: UIWindow): UIView {
    const view = new UIView(RectMake(0, 0, 48, 48));
    view.setBackgroundColor(colors.blue);
    view.addCssClass("border");
    return view;
  }
}
