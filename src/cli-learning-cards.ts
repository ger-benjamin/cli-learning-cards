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
 * Add a "__skip", "__clue" special arguments
 * Add a possibility to add "cards" on demand/from time to time
 */
export class CliLearningCards {
  private rl?: readline.Interface;
  private cardsLimit = 0;
  private readonly sourcePath: URL;
  private sourceJson?: SourceJson;
  private selectedItems: Item[] = [];

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
    this.showQuestion(this.selectedItems[0]);
    await this.readAnswer();
    this.isCorrect();
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
    const max = this.sourceJson?.items?.length ?? -1;
    const answer = parseInt(
      await this.ask(`How many cards do you want to train? (max ${max})\n`),
    );
    if (!answer || answer < 0 || answer > max) {
      console.log(`Please write a valid natural number between 0 and ${max}`);
      await this.askNumberCards();
    } else {
      this.cardsLimit = answer;
      console.log("answer ", this.cardsLimit);
    }
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
    console.log(this.selectedItems.map((item) => item.source_key_text));
  }

  // show question
  private showQuestion(item?: Item) {
    if (!item) {
      return;
    }
    const question = `Question: ${item.source_key_text}\n`;
    console.log(question);
  }

  // read answer or __skip
  //   correct ? Update date  "score" and next
  //   incorrect ? Update error and date and "next"
  //   __skip ? Update date and "next"
  private async readAnswer() {
    console.log("to implement");
  }

  // Correctness strategy
  //    Simple Az===Az
  //    more complicated ? with https://www.npmjs.com/package/fast-diff
  private isCorrect() {
    console.log("to implement");
  }

  // case > nb of item
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
