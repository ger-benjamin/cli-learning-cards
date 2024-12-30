import { Scene } from "./scene.js";
import type { Item } from "../source-json.js";
import { HintStrategy } from "../hint-strategy.js";
import { getOneSideText } from "../utils.js";
import gs from "../game-state.js";

export class CardScene extends Scene {
  private readonly hintStrategy = new HintStrategy();

  constructor() {
    super();
    this.content.set("line1", "line1");
    this.content.set("line2", "line2");
    this.content.set("line3", "line3");
    gs.getCurrentCardItem().on("change", (item) => {
      this.setQuestion(item, gs.getShowHint().getValue() ?? false);
      this.render();
    });
    gs.getShowHint().on("change", (showHint) => {
      const item = gs.getCurrentCardItem().getValue();
      if (item) {
        this.setQuestion(item, showHint);
        this.render();
      }
    });
    const item = gs.getCurrentCardItem().getValue();
    if (item) {
      this.setQuestion(item, gs.getShowHint().getValue() ?? false);
    }
  }

  setQuestion(item: Item, hint: boolean) {
    const question = getOneSideText(gs.getSideA(item));
    const hintText = hint ? `(${this.hintStrategy.getHint(item)})` : "";
    this.content.set("line3", `${question} ${hintText}`);
  }

  override render() {
    this.clean();
    super.render();
  }
}
