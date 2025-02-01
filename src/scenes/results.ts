import { writeFileSync } from "node:fs";
import { Scene } from "./scene.js";
import gs from "../game-state.js";
import type { Item } from "../source-json.js";
import { getSideTexts } from "../utils.js";
import { drawCard } from "./draw-card.js";
import { getCardWidth } from "./card-utils.js";
import {
  Colors,
  GameStateScene,
  validNegativeAnswers,
  validPositiveAnswers,
} from "../enums.js";
import { fromAnyItemToItem } from "../json-to-source.js";
import { colorize } from "./colorize-card.js";

/**
 * A UI for results.
 */
export class ResultsScene extends Scene {
  private nextIsExit = false;

  constructor() {
    super();
    this.content.set("head", "");
    this.content.set("title", "");
    this.content.set("section", "");
  }

  override start() {
    super.start();
    this.clear();
    if ((gs.getLivesRemaining() ?? -1) > 0) {
      this.setContent("head", "Well done !", false);
    } else {
      this.setContent("head", "Game over :-(", false);
    }
    const section = this.getResults();
    section.push("");
    section.push("Do you want to save the results (y/n) ?");
    this.setContent("section", section.join("\n"));
  }

  override readLine(answer: string) {
    if (this.nextIsExit) {
      this.exit(GameStateScene.EXIT);
      return;
    }
    this.askAndSaveResults(answer);
  }

  /**
   * Prints a summary of results.
   */
  getResults(): string[] {
    const items = gs.getAnswers().map((answer) => answer.item);
    const mastered = this.getUniqueItems(
      items.filter((item) => item.errors_last === 0),
    );
    const toRevise = this.getUniqueItems(
      items.filter((item) => item.errors_last !== 0),
    );
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

  private getUniqueItems(items: Item[]): Item[] {
    const uniqItems = new Map<string, Item>();
    items.forEach((item) => {
      const existingItem = uniqItems.get(item.id);
      if (existingItem) {
        if (existingItem.last_revision < item.last_revision) {
          uniqItems.set(item.id, item);
        }
      } else {
        uniqItems.set(item.id, item);
      }
    });
    return [...uniqItems.values()];
  }

  /**
   * For one item, print "Question - last answer - possible answers".
   * @private
   */
  private printOneResult(item: Item, section: string[]) {
    const expectedPossibilities = getSideTexts(gs.getSideB(item));
    const answers = gs.getAnswers();
    const answerItem = answers.find((answer) => item.id === answer.item.id);
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
   * Ask to save the results if wanted and exit.
   * @private
   */
  askAndSaveResults(answer: string) {
    const lowerAnswer = answer.toLowerCase();
    this.content.set("section", "");
    this.content.set("title", "");
    // Only accept valid answers.
    if (!this.checkAskValidAnswer(lowerAnswer)) {
      return;
    }
    this.nextIsExit = true;
    // Exit without saving;
    if (!validPositiveAnswers.includes(lowerAnswer)) {
      this.exitWithoutSaving();
      return;
    }
    // Save and exit.
    this.saveAndExit();
  }

  /**
   * Check if it's a valid answer to the question "Do you want to save the results?"
   * @returns true if it's a valid yes/no. False, and display and new message if it's not.
   * @private
   */
  private checkAskValidAnswer(lowerAnswer: string): boolean {
    if (
      validNegativeAnswers.includes(lowerAnswer) ||
      validPositiveAnswers.includes(lowerAnswer)
    ) {
      return true;
    }
    const card = drawCard(
      ["Please answer by 'yes' or 'no'. Do you want to save the results?"],
      getCardWidth(this.tWidth),
    );
    this.setContent("head", "", false);
    this.setContent("title", colorize(card, undefined, false));
    return false;
  }

  /**
   * Prompt an exit without saving message.
   * @private
   */
  private exitWithoutSaving() {
    const card = drawCard(
      ["Ok, the results are left unsaved."],
      getCardWidth(this.tWidth),
    );
    this.setContent("title", colorize(card, undefined, false));
  }

  /**
   * Validate the validity of updated items, save them (update the source file),
   * and prompt an exit message.
   */
  private saveAndExit() {
    const answers = gs.getAnswers();
    const revisedItems = this.getUniqueItems(
      answers.map((answer) => answer.item),
    );
    const revisedItemsIds = revisedItems.map((item) => item.id);
    const notRevisedItems =
      gs
        .getSourceJson()
        ?.items.filter((item) => !revisedItemsIds.includes(item.id)) ?? [];
    const newItems = [...revisedItems, ...notRevisedItems];
    try {
      this.checkBeforeWrite(newItems);
      writeFileSync(
        gs.getSourcePath(),
        JSON.stringify({ items: newItems }, null, 2),
        {
          encoding: "utf-8",
          flag: "w", // Create or replace
        },
      );
    } catch (error) {
      const msg = (error as Error).message;
      gs.setError(`Can't save results: ${msg}`);
      return;
    }
    const card = drawCard(["Results saved!"], getCardWidth(this.tWidth));
    this.setContent("title", colorize(card, Colors.Green, false));
  }

  /**
   * Checks if the items to save are valid (uniq any and valid content).
   * Checks only, don't modify any item here.
   * Throw error if not valid.
   * @private
   */
  private checkBeforeWrite(itemsToCheck: Item[]) {
    const itemIds = new Set<string>();
    itemsToCheck.forEach((item, index) => {
      if (itemIds.has(item.id)) {
        throw new Error("Duplicated item id");
      }
      itemIds.add(item.id);
      fromAnyItemToItem(item, index);
    });
  }
}
