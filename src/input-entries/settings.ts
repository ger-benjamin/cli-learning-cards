import { SelectionStrategy } from "../selection-strategy.js";
import { parseJsonSource } from "../json-to-source.js";
import gs, { GameStateScene } from "../game-state.js";
import type { InputEntry } from "./input-entry.js";

export class SettingsIE implements InputEntry {
  private readonly selectionStrategy = new SelectionStrategy();
  private fetchingJson = false;
  private readonly sourcePath: URL;
  private readonly noAnswer = "_noAnswer";

  constructor(sourcePath: URL) {
    this.sourcePath = sourcePath;
  }

  readLine(answer: string): void {
    if (this.fetchingJson) {
      return;
    }
    if (!gs.getSourceJson()) {
      this.parseJson();
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
  }

  private async parseJson() {
    this.fetchingJson = true;
    const sourceJson = await parseJsonSource(this.sourcePath);
    if (!sourceJson || !sourceJson.items) {
      throw new Error("Can not use source json file.");
      gs.setActiveScene(GameStateScene.EXIT);
    }
    gs.setSourceJson(sourceJson);
    this.fetchingJson = false;
    this.readLine(this.noAnswer);
  }

  /**
   * Ask how many item to show.
   * @private
   */
  private askNumberCards(answer: string) {
    const defaultNb = 10;
    const max = gs.getSourceJson()?.items?.length ?? -1;
    console.log(
      `How many cards do you want to train? (default ${defaultNb}, max ${max})`,
    );
    if (answer === this.noAnswer) {
      return;
    }
    if (answer === "") {
      gs.setCardsLimit(defaultNb);
      return;
    }
    const cardsLimit = parseInt(answer);
    if (cardsLimit < 0 || cardsLimit > max) {
      console.log(`Please write a valid natural number between 0 and ${max}`);
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
    gs.setCurrentCardItem(selectedItems[0]!);
    gs.setActiveScene(GameStateScene.CARD);
  }
}
