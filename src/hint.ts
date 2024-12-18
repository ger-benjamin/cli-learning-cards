import type { Item } from "./source-json.js";
import gs from "./game-state.js";

/**
 * @returns A hint based on the item.
 */
export const getHint = (item: Item): string => {
  const hint: string[] = [];
  const words = gs.getAnswer(item).key.split(" ");
  words.forEach((word) => {
    const letters = word.split("").sort();
    hint.push(...letters);
    hint.push(" ");
  });
  hint.pop();
  return `(${hint.join("")})`;
};
