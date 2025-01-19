import type { Side } from "./source-json.js";

/**
 * @returns The side text plus all variations.
 */
export const getSideTexts = (side: Side): string[] => {
  return [side.main, ...side.variations];
};

/**
 * @returns a side text or one of the variation.
 */
export const getOneSideText = (side: Side): string => {
  const texts = getSideTexts(side);
  return takeOneRandomly(texts) ?? side.main;
};

/**
 * @returns 16 numbers between 0 and 9;
 */
export const createRandomNumbers = (): number[] => {
  const textNumbers = Math.random().toString().slice(2);
  return textNumbers.split("").map((nb) => parseInt(nb));
};

/**
 * @returns the same text, but with the first letter lowercased.
 */
export const lowerFirst = (str: string): string => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

/**
 * @returns a random item from an array and the index of the item in the original
 * array. Or [undefined, undefined] if no array
 */
const takeOneRandomlyIndexed = <T>(
  array: T[],
): [T, number] | [undefined, undefined] => {
  if (!array.length) {
    return [undefined, undefined];
  }
  const index = Math.floor(Math.random() * array.length);
  return [array[index]!, index];
};

/**
 * @returns a random item from an array or undefined if no array.
 */
export const takeOneRandomly = <T>(array: T[]): T | undefined => {
  return takeOneRandomlyIndexed(array)?.[0];
};

/**
 * @returns multiple random items from an array or an empty array if
 * the original is empty. If the "howMany" parameter exceed the length of the array
 * it returns the original array wth items in a random order.
 */
export const takeMultipleRandomly = <T>(array: T[], howMany: number): T[] => {
  if (!array.length) {
    return [];
  }
  const array2 = [...array];
  return Array(Math.min(howMany, array.length))
    .fill(null)
    .map(() => {
      const [item, index] = takeOneRandomlyIndexed(array2);
      array2.splice(index!, 1);
      return item!;
    });
};
