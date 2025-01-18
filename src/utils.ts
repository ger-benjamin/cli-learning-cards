import type { Side } from "./source-json.js";
import sample from "lodash/sample.js";

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
  return sample(texts) ?? side.main;
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
