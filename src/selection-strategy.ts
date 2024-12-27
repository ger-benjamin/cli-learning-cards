import type { Item } from "./source-json.js";
import sampleSize from "lodash/sampleSize.js";
import gs from "./game-state.js";

/** Possible Selection strategies. */
export const enum SelectionStrategies {
  RevisionDate = "Revision_date",
  Random = "Random",
}

/**
 * Get random items via a strategy.
 */
export class SelectionStrategy {
  constructor() {}

  /**
   * Select items by the selected selection strategy.
   * @returns a list of items.
   */
  selectItems(items: Item[], howMany: number): Item[] {
    if (gs.getSelectionStrategy() === SelectionStrategies.Random) {
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
    return sampleSize(items, howMany);
  }
}
