import { lightMessenger as lmsg } from "./messenger.js";
import type { Side } from "./source-json.js";
import sample from "lodash/sample.js";

/**
 * @returns a parsed Date or log an error and returns "now".
 */
export const parseItemDate = (id: string, date: Date | string): Date => {
  const parsedDate = new Date(date);
  if (!parsedDate || isNaN(parsedDate.getTime())) {
    lmsg.error(`Wrong date format on entry: ${id}, use now instead.`);
    return new Date();
  }
  return parsedDate;
};

/**
 * @returns The side text plus all variations.
 */
export const getSideTexts = (side: Side): string[] => {
  return [side.key, ...side.variations];
};

/**
 * @returns a side text or one of the variation.
 */
export const getOneSideText = (side: Side): string => {
  const texts = getSideTexts(side);
  return sample(texts) ?? side.key;
};
