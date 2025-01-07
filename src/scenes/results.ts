import { writeFileSync } from "node:fs";
import { Scene } from "./scene.js";
import gs, { GameStateScene } from "../game-state.js";
import type { Item } from "../source-json.js";
import { getSideTexts } from "../utils.js";

/**
 * A UI for results.
 */
export class ResultsScene extends Scene {
  private nextIsExit = false;

  constructor() {
    super();
    this.content.set("title", "");
    this.content.set("section", "");
  }

  override start() {
    this.clear();
    const section = this.getResults(gs.getSelectedItems());
    section.push("");
    section.push("Do you want to save the results (y/n) ?");
    this.setContent("section", section.join("\n"));
  }

  override readLine(answer: string) {
    if (this.nextIsExit) {
      this.exit(GameStateScene.EXIT);
      return;
    }
    this.nextIsExit = true;
    this.saveResults(answer);
  }

  /**
   * Prints a summary of results.
   */
  getResults(items: Item[]): string[] {
    const mastered = items.filter((item) => item.errors_last === 0);
    const toRevise = items.filter((item) => item.errors_last !== 0);
    this.content.set(
      "title",
      `
Results:
(Question - last answer - possible answers)
`,
    );
    const section: string[] = [];
    if (mastered.length) {
      section.push("Perfectly known:");
      mastered.forEach((item) => {
        this.printOneResult(item, section);
      });
    }
    section.push("");
    if (toRevise.length) {
      section.push("To revise again:");
      toRevise.forEach((item) => {
        this.printOneResult(item, section);
      });
    }
    return section;
  }

  /**
   * For one item, print "Question - last answer - possible answers".
   * @private
   */
  private printOneResult(item: Item, section: string[]) {
    const expectedPossibilities = getSideTexts(gs.getSideB(item));
    const answers = gs.getAnswers();
    const answerItem = answers.find((answer) => item.id === answer.id);
    if (!answerItem) {
      return;
    }
    const expectedMain = expectedPossibilities.shift();
    const questionAnswerTxt = `${answerItem.displayedQuestion} - ${answerItem.userAnswer}`;
    section.push(`${questionAnswerTxt} - ${expectedMain}`);
    if (!expectedPossibilities.length) {
      return;
    }
    const spacers = Array(questionAnswerTxt.length).fill(" ").join("");
    expectedPossibilities.forEach((expected) => {
      section.push(`${spacers} - ${expected}`);
    });
  }

  /**
   * Update source file with results.
   * @private
   */
  saveResults(answer: string) {
    this.content.set("section", "");
    this.content.set("title", "");
    if (!["yes", "y", "1", "true", "t"].includes(answer.toLowerCase())) {
      this.setContent("title", "No results saved.");
      return;
    }
    const revisedItemsIds = gs.getSelectedItems().map((item) => item.id);
    const notRevisedItems =
      gs
        .getSourceJson()
        ?.items.filter((item) => !revisedItemsIds.includes(item.id)) ?? [];
    const newItems = [...gs.getSelectedItems(), ...notRevisedItems];
    try {
      writeFileSync(
        gs.getSourcePath(),
        JSON.stringify({ items: newItems }, null, 2),
        {
          encoding: "utf-8",
          flag: "w", // Create or replace
        },
      );
    } catch (error) {
      gs.setError(`${error}`);
      return;
    }
    this.setContent("title", "Results saved!");
  }
}
