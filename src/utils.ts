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
