import type { Item } from "./source-json.js";

/**
 * Answer given by a player.
 * The "id" could be not unique.
 */
export interface Answer {
  item: Item;
  userAnswer: string;
  displayedQuestion: string;
}
