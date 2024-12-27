import type { Item } from "./source-json.js";
import { lightMessenger as lmsg } from "./messenger.js";
import gs from "./game-state.js";
import { getSideTexts } from "./utils.js";

/**
 * For one item, print "Question - last answer - possible answers".
 */
const printOneResult = (item: Item) => {
  const expectedPossibilities = getSideTexts(gs.getSideB(item));
  const answers = gs.getAnswers();
  const answerItem = answers.find((answer) => (item.id = answer.id));
  if (!answerItem) {
    return;
  }
  const expectedMain = expectedPossibilities.shift();
  const questionAnswerTxt = `${answerItem.question} - ${answerItem.answer}`;
  lmsg.log(`${questionAnswerTxt} - ${expectedMain}\n`);
  if (!expectedPossibilities.length) {
    return;
  }
  const spacers = Array(questionAnswerTxt.length).fill(" ").join("");
  expectedPossibilities.forEach((expected) => {
    lmsg.log(`${spacers} - ${expected}\n`);
  });
};

/**
 * Prints a summary of results.
 */
export const printResults = (items: Item[]) => {
  const mastered = items.filter((item) => item.errors_last === 0);
  const toRevise = items.filter((item) => item.errors_last !== 0);
  lmsg.showSeparation();
  lmsg.log("Results:");
  lmsg.log("(Question - last answer - possible answers)");
  if (mastered.length) {
    lmsg.log("Perfectly known:");
    mastered.forEach((item) => {
      printOneResult(item);
    });
  }
  if (toRevise.length) {
    lmsg.log("To revise again:");
    toRevise.forEach((item) => {
      printOneResult(item);
    });
  }
};
