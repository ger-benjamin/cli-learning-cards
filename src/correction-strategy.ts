import type { Item } from "./source-json.js";
import { lightMessenger as lmsg } from "./messenger.js";
import { getSideTexts } from "./utils.js";
import lowerFirst from "lodash/lowerFirst.js";
import gs from "./game-state.js";

/** Possible Correction strategies. */
export const enum CorrectionStrategies {
  Simple = "simple",
}

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
   * Compares the item (key and variation) and the answer to check if
   * the answer is correct.
   * The strategy is a simple match with first letter lowercase
   * and trimmed (aZ === AZ).
   * @returns true if the answer is correct, false otherwise.
   * @private
   */
  private checkSimple(item: Item, answer: string): boolean {
    const expectedTexts = getSideTexts(gs.getSideB(item));
    // Remove last point, colon, etc.
    const modifiedAnswer = this.sanitize(answer);
    return expectedTexts.some((expected) => {
      const modifiedExpected = this.sanitize(expected);
      lmsg.debug(`src: ${modifiedExpected} - asw: ${modifiedAnswer}`);
      return modifiedExpected === modifiedAnswer;
    });
  }

  /**
   * Remove not alphanumerical characters until the first one and
   * after the last one. Lower case the first alphabetical character.
   * @returns the sanitized text.
   * @private
   */
  private sanitize(text: string) {
    const cleanedStartAndEnd = text.replace(
      /^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g,
      "",
    );
    return lowerFirst(cleanedStartAndEnd);
  }
}
