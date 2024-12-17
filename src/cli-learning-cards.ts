import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { readFile } from "node:fs/promises";
import type { Item, SourceJson } from "./source-json.js";
import lowerFirst from "lodash/lowerFirst.js";
import trim from "lodash/trim.js";

/**
 * Cli Learning cards main process.
 * Read source, ask number of element to revise, prompt
 * card and handle answers.
 *
 * TODO and ideas
 * Finish first process implementation.
 * Add "__favorite" special arguments
 * Add a possibility to add "cards" on demand/from time to time
 * Add a possibility to select the "select card" strategy.
 * Add colors.
 * Add a "reverse game" possibility, or random order, time, challenge....
 */
export class CliLearningCards {
  private rl?: readline.Interface;
  private cardsLimit = 0;
  private readonly sourcePath: URL;
  private sourceJson?: SourceJson;
  private selectedItems: Item[] = [];
  private questionIndex = 0;
  private readonly today = new Date();

  constructor(sourcePath: URL) {
    this.sourcePath = sourcePath;
  }

  /**
   * Start the read-line stram and the questions processes.
   */
  async run() {
    this.rl = readline.createInterface({ input: stdin, output: stdout });
    await this.readJsonSource();
    if (!this.sourceJson || !this.sourceJson.items) {
      console.error("Can not use source json file.");
      this.stop();
    }
    await this.askNumberCards();
    this.selectItems();
    await this.processItems();
    this.showResults();
    this.saveResults();
    this.stop();
  }

  /**
   * Close the read-line stream.
   */
  stop() {
    this.rl?.close();
  }

  /**
   * Read the source json file.
   * @private
   */
  private async readJsonSource() {
    try {
      const contents = await readFile(this.sourcePath, { encoding: "utf8" });
      this.sourceJson = JSON.parse(contents);
    } catch (err) {
      console.error((err as Error).message);
    }
  }

  /**
   * Ask how many item to show.
   * @private
   */
  private async askNumberCards() {
    const defaultNb = 10;
    const max = this.sourceJson?.items?.length ?? -1;
    const answer = await this.ask(
      `How many cards do you want to train? (default ${defaultNb}, max ${max})\n`,
    );
    if (answer === "") {
      this.cardsLimit = defaultNb;
      return;
    }
    const cardsLimit = parseInt(answer);
    if (cardsLimit < 0 || cardsLimit > max) {
      console.log(`Please write a valid natural number between 0 and ${max}`);
      await this.askNumberCards();
      return;
    }
    this.cardsLimit = cardsLimit;
  }

  /**
   * Get a random item via a strategy.
   * @private
   */
  private selectItems() {
    const items = [...(this.sourceJson?.items ?? [])];
    // Default strategy is by last revision date.
    items.sort((item1, item2) => +item1.last_revision - +item2.last_revision);
    this.selectedItems = items.slice(0, this.cardsLimit);
  }

  /**
   * Loop on question to ask.
   * @private
   */
  private async processItems() {
    while (this.questionIndex < this.cardsLimit) {
      const item = this.selectedItems[this.questionIndex]!;
      item.error_count = 0;
      await this.processQuestion(item);
      this.questionIndex++;
    }
  }

  /**
   * Show question and check answer.
   * Process is locked until the right answer is given.
   * Update date and error count in the question.
   * On "__clue", it shows additional clue.
   * On "__skip", it leaves the question.
   * @private
   */
  private async processQuestion(item: Item, clue = false) {
    const question = `${item.source_key_text}`;
    const clueText = clue ? this.getClueText(item) : "";
    const answer = await this.ask(`${question} ${clueText}\n`);
    if (answer === "") {
      await this.processQuestion(item);
      return;
    }
    if (answer === "__skip") {
      console.log(`=> ${item.source_value_text}\n`);
      return;
    }
    if (answer === "__clue") {
      await this.processQuestion(item, true);
      return;
    }
    const valid = this.isCorrect(item, answer);
    if (!valid) {
      item.error_count++;
      await this.processQuestion(item, clue);
      return;
    }
    item.last_revision = this.today;
    console.log(`Correct :-)\n`);
    return;
  }

  /**
   * @returns A clue based on the item.
   * @private
   */
  private getClueText(item: Item): string {
    const clue: string[] = [];
    const words = item.source_value_text.split(" ");
    words.forEach((word) => {
      const letters = word.split("").sort();
      clue.push(...letters);
      clue.push(" ");
    });
    clue.pop();
    return `(${clue.join("")})`;
  }

  /**
   * Compares the item and the answer to check if the answer is correct.
   * The current strategy is simple (aZ === AZ).
   * @returns true if the answer is correct, false otherwise.
   * @private
   */
  private isCorrect(item: Item, answer: string): boolean {
    const source = item.source_value_text;
    // move to another "clean" function
    // Remove also last point, colon, etc.
    const modifiedSource = trim(lowerFirst(source));
    const modifiedAnswer = trim(lowerFirst(answer));
    console.log("Debug: ", modifiedSource, modifiedAnswer);
    // more complicated ? with https://www.npmjs.com/package/fast-diff
    return modifiedSource === modifiedAnswer;
  }

  /**
   * Prints a summary of results.
   * @private
   */
  private showResults() {
    const mastered = this.selectedItems.filter(
      (item) => item.error_count === 0,
    );
    const toRevise = this.selectedItems.filter(
      (item) => item.error_count !== 0,
    );
    console.log("Results:");
    if (mastered.length) {
      console.log("Perfectly known:");
      mastered.forEach((item) => {
        console.log(`- ${item.source_key_text} => ${item.source_value_text}\n`);
      });
    }
    if (toRevise.length) {
      console.log("To revise again:");
      toRevise.forEach((item) => {
        console.log(`- ${item.source_key_text} => ${item.source_value_text}\n`);
      });
    }
  }

  // Ask to save result (update source!)
  private saveResults() {
    console.log("Save results to implement");
  }

  /**
   * Prompt a question and wait on user's input.
   * @param text the question to ask.
   * @returns A promise with the answer.
   * @private
   */
  private async ask(text: string): Promise<string> {
    if (!this.rl) {
      return "";
    }
    return await this.rl.question(text);
  }
}
