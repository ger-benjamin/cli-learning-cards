import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { readFile } from "node:fs/promises";
import type { Item, SourceJson } from "./source-json.js";

/**
 * Cli Learning cards main process.
 * Read source, ask number of element to revise, prompt
 * card and handle answers.
 *
 * TODO and ideas
 * Finish first process implementation.
 * Add a "__skip", "__clue", "__favorite" special arguments
 * Add a possibility to add "cards" on demand/from time to time
 * Add a possibility to select the "select card" strategy.
 * Add a "reverse game" possibility, or random order.
 */
export class CliLearningCards {
  private rl?: readline.Interface;
  private cardsLimit = 0;
  private readonly sourcePath: URL;
  private sourceJson?: SourceJson;
  private selectedItems: Item[] = [];
  private questionIndex = 0;

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
    this.showResult();
    this.saveResult();
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

  private async processItems() {
    if (this.questionIndex >= this.cardsLimit) {
      return;
    }
    const item = this.selectedItems[this.questionIndex]!;
    await this.processQuestion(item);
    this.questionIndex++;
    await this.processItems();
  }

  // Show question
  //   __skip ? Update date and "next"
  //   correct ? Update date  "score" and next
  private async processQuestion(item: Item, clue = false) {
    // TODO update error count to 0
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
      // TODO update errorCount
      await this.processQuestion(item, clue);
      return;
    }
    // TODO update date and show happiness
    return;
  }

  private getClueText(item: Item): string {
    // TODO is rough
    const letters = item.source_value_text.split("");
    letters.sort();
    return `(${letters.join("")})`;
  }

  // Correctness strategy
  //    Simple Az===Az
  //    more complicated ? with https://www.npmjs.com/package/fast-diff
  private isCorrect(item: Item, answer: string): boolean {
    return item.source_value_text === answer;
  }

  // case > nb of item
  // show correct and not correct
  private showResult() {
    console.log("to implement");
  }

  // show result and save y/n
  // Update file on yes
  private saveResult() {
    console.log("to implement");
  }

  private async ask(text: string): Promise<string> {
    if (!this.rl) {
      return "";
    }
    return await this.rl.question(text);
  }
}
