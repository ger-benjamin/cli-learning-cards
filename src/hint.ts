import type { Item } from "./source-json.js";

/**
 * @returns A hint based on the item.
 */
export const getHint = (item: Item): string => {
  const hint: string[] = [];
  const words = item.source_value_text.split(" ");
  words.forEach((word) => {
    const letters = word.split("").sort();
    hint.push(...letters);
    hint.push(" ");
  });
  hint.pop();
  return `(${hint.join("")})`;
};