import gs from "./game-state.js";
import { getOneSideText, takeMultipleRandomly } from "./utils.js";
import type { Item } from "./source-json.js";
import { HintStrategies } from "./enums.js";

/**
 * Select a strategy to display a hint on an answer.
 */
export class HintStrategy {
  constructor() {}

  /**
   * @returns A hint based on the answer and the selected hint strategy.
   */
  getHint(item: Item): string {
    const answerText = getOneSideText(gs.getSideB(item));
    if (gs.getHintStrategy() === HintStrategies.SomeWords) {
      return this.someWords(answerText);
    }
    return this.sortLetters(answerText);
  }

  /**
   * @returns one answer text but, per word, with each letter sort.
   */
  private sortLetters(answerText: string): string {
    const hint: string[] = [];
    const words = answerText.split(" ");
    words.forEach((word) => {
      const letters = word.split("").sort();
      hint.push(...letters);
      hint.push(" ");
    });
    hint.pop();
    return `${hint.join("")}`;
  }

  /**
   * @returns one answer text but only the half of words of it. Or
   * fallback on the sortLetters strategy if the text is shorter als 3 words.
   */
  private someWords(answerText: string): string {
    const words = answerText.split(" ");
    // Fallback on sortLetters strategy if there are less than 3 words.
    if (words.length < 3) {
      return this.sortLetters(answerText);
    }
    const toRemoveIndexes: number[] = [];
    // Find the longest word to hide it.
    let longerWordIndex = 0;
    words.forEach((word, index) => {
      if (index === 0) {
        return;
      }
      if (word.length > words[longerWordIndex]!.length) {
        longerWordIndex = index;
      }
    });
    toRemoveIndexes.push(longerWordIndex);
    // Then remove 20% of extra words.
    const wordsWithoutLongest = [...words];
    wordsWithoutLongest.splice(longerWordIndex, 1);
    const wordsToRemove = takeMultipleRandomly(
      wordsWithoutLongest,
      Math.floor(wordsWithoutLongest.length / 5),
    );
    words.forEach((word, index) => {
      if (wordsToRemove.includes(word)) {
        toRemoveIndexes.push(index);
      }
    });
    const hint = words.map((word, index) => {
      if (toRemoveIndexes.includes(index)) {
        return "...";
      }
      return word;
    });
    return `${hint.join(" ")}`;
  }
}
