import { lightMessenger as lmsg } from "./messenger.js";

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
