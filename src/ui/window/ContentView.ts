import { Rect } from "../Rect";
import { UIView } from "../View";

export class ContentView extends UIView {
  constructor(aRect: Rect) {
    super(aRect);
    this.autoresizesSubviews = true;

    // console.log('Created a ContentView');
  }
}
