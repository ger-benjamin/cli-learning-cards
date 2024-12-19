import type { Item } from "./source-json.js";
import trim from "lodash/trim.js";
import lowerFirst from "lodash/lowerFirst.js";
import { lightMessenger as lmsg } from "./messenger.js";
import gs from "./game-state.js";

/**
 * Select a strategy for the comparison between the expected answer, and
 * the actual answer.
 */
export class CorrectionStrategy {
  constructor() {}

  // more complicated ? with https://www.npmjs.com/package/fast-diff

  /**
   * Check the answer with the selected correction strategy.
   * @returns true if the answer is correct, false otherwise.
   */
  isCorrect(item: Item, answer: string): boolean {
    return this.checkSimple(item, answer);
  }

  /**
   * Compares the item and the answer to check if the answer is correct.
   * The strategy is a simple match with first letter lowercase
   * and trimmed (aZ === AZ).
   * @returns true if the answer is correct, false otherwise.
   * @private
   */
  private checkSimple(item: Item, answer: string): boolean {
    const expected = gs.getAnswer(item).key;
    // Remove also last point, colon, etc.
    const modifiedExpected = trim(lowerFirst(expected));
    const modifiedAnswer = trim(lowerFirst(answer));
    lmsg.debug(`src: ${modifiedExpected} - asw: ${modifiedAnswer}`);
    return modifiedExpected === modifiedAnswer;
  }
}
