import { readFile } from "node:fs/promises";
import type { Item, SourceJson } from "./source-json.js";
import { SelectStrategy } from "./select-strategy.js";
import { getHint } from "./hint.js";
import { CorrectionStrategy } from "./correction-strategy.js";
import { printResults } from "./results.js";
import { Messenger } from "./messenger.js";
import { writeFileSync } from "node:fs";
import gs from "./game-state.js";

/**
 * Cli Learning cards main process.
 * Read source, ask number of element to revise, prompt
 * card and handle answers.
 */
export class CliLearningCards {
  private readonly now = new Date();
  private readonly selectStrategy = new SelectStrategy();
  private readonly correctionStrategy = new CorrectionStrategy();
  private readonly msg = new Messenger();
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
    gs.setQuestionIsFront(Math.random() > 0.5);
    await this.processItems();
    printResults(this.selectedItems);
    await this.saveResults();
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
    const question = gs.getQuestion(item).key;
    const hintText = hint ? getHint(item) : "";
    const answer = await this.msg.ask(`${question} ${hintText}\n`);
    if (answer === "") {
      await this.processQuestion(item);
      return;
    }
    if (answer === "__skip") {
      this.msg.log(`=> ${gs.getAnswer(item)}\n`);
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
    item.revision_count++;
    item.last_revision = this.now;
    this.msg.log(`Correct :-)\n`);
    return;
  }

  /**
   * Update source file with results.
   * @private
   */
  private async saveResults() {
    const answer = await this.msg.ask("Do you want to save the results?");
    if (!["yes", "y", "1", "true", "t"].includes(answer.toLowerCase())) {
      this.msg.log("No results saved.");
      this.msg.log("Bye o/");
      return;
    }
    const revisedItemsIds = this.selectedItems.map((item) => item.id);
    const notRevisedItems =
      this.sourceJson?.items.filter(
        (item) => !revisedItemsIds.includes(item.id),
      ) ?? [];
    const newItems = [...this.selectedItems, ...notRevisedItems];
    writeFileSync(
      this.sourcePath,
      JSON.stringify({ items: newItems }, null, 2),
      {
        encoding: "utf-8",
        flag: "w", // Create or replace
      },
    );
    this.msg.log("Results saved!");
    this.msg.log("Bye o/");
  }
}
