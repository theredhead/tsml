import { Content } from "../content-decorator.js";
import { Observable } from "../observable-decorators.js";
import { ObservableHost } from "../observable-core.js";

@Content("children")
export class VBox extends ObservableHost {
  @Observable() spacing = 0;
  children: any[] = [];
  add(v: any) {
    this.children.push(v);
  }
}

export class Label extends ObservableHost {
  @Observable() text: string = "";
}

export class ActionButton extends ObservableHost {
  @Observable() text: string = "";
  constructor(private theme: any, private analytics: any) {
    super();
  }
  click() {
    this.analytics?.track?.("click", { text: this.text });
  }
}
