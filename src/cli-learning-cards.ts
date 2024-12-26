import { readFile } from "node:fs/promises";
import type { Item, SourceJson } from "./source-json.js";
import { SelectionStrategy } from "./selection-strategy.js";
import { getHint } from "./hint.js";
import { CorrectionStrategy } from "./correction-strategy.js";
import { printResults } from "./results.js";
import { Messenger } from "./messenger.js";
import { writeFileSync } from "node:fs";
import gs from "./game-state.js";
import { parseItemDate } from "./utils.js";

/**
 * Cli Learning cards main process.
 * Read source, ask number of element to revise, prompt
 * card and handle answers.
 */
export class CliLearningCards {
  private readonly now = new Date();
  private readonly selectionStrategy = new SelectionStrategy();
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
    if (!gs.getAnswers().length) {
      this.stop();
      return;
    }
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
      this.sourceJson?.items.forEach(
        (item) =>
          (item.last_revision = parseItemDate(item.id, item.last_revision)),
      );
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
    this.selectedItems = this.selectionStrategy.selectItems(
      items,
      this.cardsLimit,
    );
  }

  /**
   * Loop on question to ask.
   * @private
   */
  private async processItems(): Promise<void> {
    while (this.questionIndex < this.cardsLimit) {
      const item = this.selectedItems[this.questionIndex]!;
      item.errors_last = 0;
      await this.processQuestion(item);
      this.questionIndex++;
      if (gs.isGameStopped()) {
        this.questionIndex = Infinity;
      }
    }
  }

  /**
   * Show question and check answer.
   * Process is locked until the right answer is given.
   * Update date and error count in the question.
   * On "_hint", it shows additional hint.
   * On "_skip", it leaves the question.
   * On "_exit", quit earlier the questions process.
   * @private
   */
  private async processQuestion(item: Item, hint = false): Promise<void> {
    const question = gs.getSideA(item).key;
    const hintText = hint ? getHint(item) : "";
    const answer = await this.msg.ask(`${question} ${hintText}\n`);
    if (answer === "") {
      await this.processQuestion(item, hint);
      return;
    }
    if (answer === "_exit") {
      gs.stopGame();
      return;
    }
    if (answer === "_skip") {
      this.msg.log(`=> ${gs.getSideB(item)}\n`);
      return;
    }
    if (answer === "_hint") {
      await this.processQuestion(item, true);
      return;
    }
    if (answer[0] === "_") {
      this.msg.log(`This command is not valid.\n`);
      await this.processQuestion(item, hint);
      return;
    }
    gs.addAnswers({
      answer,
      question,
      id: item.id,
    });
    const valid = this.correctionStrategy.isCorrect(item, answer);
    if (!valid) {
      item.errors_total++;
      item.errors_last++;
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
