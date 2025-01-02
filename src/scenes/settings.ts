import { Scene } from "./scene.js";
import { SelectionStrategy } from "../selection-strategy.js";
import { parseJsonSource } from "../json-to-source.js";
import gs, { GameStateScene } from "../game-state.js";

export class SettingsScene extends Scene {
  private readonly selectionStrategy = new SelectionStrategy();
  private readonly noAnswer = "_noAnswer";
  private fetchingJson = true;

  constructor() {
    super();
    this.content.set("load", "Loadings...");
    this.content.set("question", "");
    this.content.set("info", "");
    if (!gs.getSourceJson()) {
      this.parseJson();
    }
  }

  override readLine(answer: string): void {
    if (this.fetchingJson || !gs.getSourceJson()) {
      return;
    }
    if (!gs.getCardsLimit()) {
      this.askNumberCards(answer);
      if (!gs.getCardsLimit()) {
        return;
      }
    }
    gs.setQuestionIsFront(Math.random() > 0.5);
    this.selectItems();
    this.exit(GameStateScene.CARD);
  }

  private async parseJson() {
    this.fetchingJson = true;
    const sourceJson = await parseJsonSource(gs.getSourcePath());
    if (!sourceJson || !sourceJson.items) {
      throw new Error("Can not use source json file.");
      this.exit(GameStateScene.EXIT);
    }
    gs.setSourceJson(sourceJson);
    this.fetchingJson = false;
    this.content.delete("load");
    this.readLine(this.noAnswer);
  }

  /**
   * Ask how many item to show.
   * @private
   */
  private askNumberCards(answer: string) {
    const defaultNb = 10;
    const max = gs.getSourceJson()?.items?.length ?? -1;
    const question = `How many cards do you want to train? (default ${defaultNb}, max ${max})`;
    this.setContent("question", question);
    if (answer === "") {
      gs.setCardsLimit(defaultNb);
      return;
    }
    const cardsLimit = parseInt(answer);
    if (cardsLimit < 0 || cardsLimit > max) {
      this.setContent(
        "info",
        `Please write a valid natural number between 0 and ${max}`,
      );
      return;
    }
    gs.setCardsLimit(cardsLimit);
  }

  /**
   * Get random items via a strategy.
   * @private
   */
  private selectItems() {
    const items = [...(gs.getSourceJson()?.items ?? [])];
    const selectedItems = this.selectionStrategy.selectItems(
      items,
      gs.getCardsLimit(),
    );
    gs.setSelectedItems(selectedItems);
  }
}
