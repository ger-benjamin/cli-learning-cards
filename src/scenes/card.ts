import { Scene } from "./scene.js";
import type { Item } from "../source-json.js";
import { HintStrategy } from "../hint-strategy.js";
import { getOneSideText } from "../utils.js";
import gs, { GameStateScene } from "../game-state.js";
import { CorrectionStrategy } from "../correction-strategy.js";

export class CardScene extends Scene {
  private readonly hintStrategy = new HintStrategy();
  private readonly correctionStrategy = new CorrectionStrategy();
  private readonly now = new Date();
  private item: Item;
  private hint = false;

  constructor() {
    super();
    this.content.set("mode", "");
    this.content.set("game", "");
    this.content.set("card", "");
    this.content.set("info", "");
    const selectedItems = gs.getSelectedItems();
    const item = selectedItems[0];
    if (!item) {
      throw new Error("No item, exit");
    }
    this.item = item!;
    this.showQuestion(this.item, this.hint, true);
  }

  showQuestion(item: Item, hint: boolean, silent = false) {
    const question = getOneSideText(gs.getSideA(item));
    const hintText = hint ? `(${this.hintStrategy.getHint(item)})` : "";
    this.setContent("card", `${question} ${hintText}`, silent);
  }

  /**
   * Show question and check answer.
   * Process is locked until the right answer is given.
   * Update date and error count in the question.
   * On "_hint", it shows additional hint.
   * On "_skip", it leaves the question.
   * On "_exit", quit earlier the questions process.
   */
  override readLine(answer: string): void {
    const question = getOneSideText(gs.getSideA(this.item));
    const expected = getOneSideText(gs.getSideB(this.item));
    if (answer === "") {
      return;
    }
    if (answer === "_exit") {
      gs.setActiveScene(GameStateScene.RESULTS);
      return;
    }
    if (answer === "_skip") {
      this.setContent("info", `=> ${expected}`);
      this.nextQuestion();
      return;
    }
    if (answer === "_hint") {
      this.hint = true;
      this.showQuestion(this.item, this.hint);
      return;
    }
    if (answer[0] === "_") {
      this.setContent("info", `This command is not valid.`);
      return;
    }
    gs.addAnswers({
      answer,
      question,
      id: this.item.id,
    });
    const valid = this.correctionStrategy.isCorrect(this.item, answer);
    if (!valid) {
      this.item.errors_total++;
      this.item.errors_last++;
      this.setContent("info", `WRONG !`);
      return;
    }
    this.item.revision_count++;
    this.item.last_revision = this.now;
    this.setContent("info", `Correct :-)`);
    this.nextQuestion();
  }

  private nextQuestion() {
    gs.setQuestionIndex(gs.getQuestionIndex() + 1);
    if (gs.getQuestionIndex() >= gs.getCardsLimit()) {
      this.exit(GameStateScene.RESULTS);
      return;
    }
    this.item = gs.getSelectedItems()[gs.getQuestionIndex()]!;
    this.item.errors_last = 0;
    this.hint = false;
    this.setContent("info", "", true);
    this.showQuestion(this.item, this.hint);
  }
}
