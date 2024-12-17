import { readFile } from "node:fs/promises";
import type { Item, SourceJson } from "./source-json.js";
import { SelectStrategy } from "./select-strategy.js";
import { getHint } from "./hint.js";
import { CorrectionStrategy } from "./correction-strategy.js";
import { printResults } from "./results.js";
import { Messager } from "./messager.js";

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
  private readonly today = new Date();
  private readonly selectStrategy = new SelectStrategy();
  private readonly correctionStrategy = new CorrectionStrategy();
  private readonly msg = new Messager();
  private readonly sourcePath: URL;
  private cardsLimit = 0;
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
    this.msg.init();
    await this.readJsonSource();
    if (!this.sourceJson || !this.sourceJson.items) {
      this.msg.error("Can not use source json file.");
      this.stop();
    }
    await this.askNumberCards();
    this.selectItems();
    await this.processItems();
    printResults(this.selectedItems);
    this.saveResults();
    this.stop();
  }

  /**
   * Close the read-line stream.
   */
  stop() {
    this.msg.stop();
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
    const answer = await this.msg.ask(
      `How many cards do you want to train? (default ${defaultNb}, max ${max})`,
    );
    if (answer === "") {
      this.cardsLimit = defaultNb;
      return;
    }
    const cardsLimit = parseInt(answer);
    if (cardsLimit < 0 || cardsLimit > max) {
      this.msg.log(`Please write a valid natural number between 0 and ${max}`);
      await this.askNumberCards();
      return;
    }
    this.cardsLimit = cardsLimit;
  }

  /**
   * Get random items via a strategy.
   * @private
   */
  private selectItems() {
    const items = [...(this.sourceJson?.items ?? [])];
    this.selectedItems = this.selectStrategy.selectItems(
      items,
      this.cardsLimit,
    );
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
   * On "__hint", it shows additional hint.
   * On "__skip", it leaves the question.
   * @private
   */
  private async processQuestion(item: Item, hint = false) {
    const question = `${item.source_key_text}`;
    const hintText = hint ? getHint(item) : "";
    const answer = await this.msg.ask(`${question} ${hintText}\n`);
    if (answer === "") {
      await this.processQuestion(item);
      return;
    }
    if (answer === "__skip") {
      this.msg.log(`=> ${item.source_value_text}\n`);
      return;
    }
    if (answer === "__hint") {
      await this.processQuestion(item, true);
      return;
    }
    const valid = this.correctionStrategy.isCorrect(item, answer);
    if (!valid) {
      item.error_count++;
      await this.processQuestion(item, hint);
      return;
    }
    item.last_revision = this.today;
    this.msg.log(`Correct :-)\n`);
    return;
  }

  // Ask to save result (update source!)
  private saveResults() {
    this.msg.log("Save results to implement");
  }
}
