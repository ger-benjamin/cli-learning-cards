import type { Item } from "./source-json.js";

/**
 * Get random items via a strategy.
 */
export class SelectStrategy {
  constructor() {}

  /**
   * Select items by the selected selection strategy.
   * @returns a list of items.
   */
  selectItems(items: Item[], howMany: number): Item[] {
    return this.selectItemsByDate(items, howMany);
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
}
