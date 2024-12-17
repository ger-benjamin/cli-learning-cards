import type { Item } from "./source-json.js";
import shuffle from "lodash/shuffle.js";

export enum Strategies {
  Date = "date",
  Random = "random",
}

/**
 * Get random items via a strategy.
 */
export class SelectStrategy {
  private strategy: string = Strategies.Random;

  constructor() {}

  /**
   * Select items by the selected selection strategy.
   * @returns a list of items.
   */
  selectItems(items: Item[], howMany: number): Item[] {
    if (this.strategy === Strategies.Random) {
      return this.selectRandomItems(items, howMany);
    }
    return this.selectItemsByDate([...items], howMany);
  }

  /**
   * Get items by last_revision date (older first).
   * @returns a list of items.
   * @private
   */
  private selectItemsByDate(items: Item[], howMany: number) {
    items.sort((item1, item2) => +item1.last_revision - +item2.last_revision);
    return items.slice(0, howMany);
  }

  /**
   * Get items randomly date.
   * @returns a list of items.
   * @private
   */
  private selectRandomItems(items: Item[], howMany: number) {
    return shuffle(items).slice(0, howMany);
  }
}
