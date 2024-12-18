import type { Item } from "./source-json.js";
import { lightMessenger as lmsg } from "./messenger.js";
import gs from "./game-state.js";

/**
 * Prints a summary of results.
 */
export const printResults = (items: Item[]) => {
  const mastered = items.filter((item) => item.error_count === 0);
  const toRevise = items.filter((item) => item.error_count !== 0);
  lmsg.showSeparation();
  lmsg.log("Results:");
  if (mastered.length) {
    lmsg.log("Perfectly known:");
    mastered.forEach((item) => {
      lmsg.log(`- ${gs.getQuestion(item).key} => ${gs.getAnswer(item).key}\n`);
    });
  }
  if (toRevise.length) {
    lmsg.log("To revise again:");
    toRevise.forEach((item) => {
      lmsg.log(`- ${gs.getQuestion(item).key} => ${gs.getAnswer(item).key}\n`);
    });
  }
};
