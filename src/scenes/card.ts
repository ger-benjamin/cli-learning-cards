import { Scene } from "./scene.js";
import type { Item } from "../source-json.js";
import { HintStrategy } from "../hint-strategy.js";
import { getOneSideText } from "../utils.js";
import gs from "../game-state.js";
import { CorrectionStrategy } from "../correction-strategy.js";
import { drawCard } from "./draw-card.js";
import { getCardWidth } from "./card-utils.js";
import { SelectionStrategy } from "../selection-strategy.js";
import { GameStateScene } from "../enums.js";

/**
 * A UI for cards questions.
 */
export class CardScene extends Scene {
  private readonly hintStrategy = new HintStrategy();
  private readonly correctionStrategy = new CorrectionStrategy();
  private readonly selectionStrategy = new SelectionStrategy();
  private readonly now = new Date();
  private item: Item | null = null;
  private hint = false;

  constructor() {
    super();
    this.content.set("mode", "");
    this.content.set("game", "");
    this.content.set("card", "");
    this.content.set("info", "");
    const item = this.selectItem();
    if (!item) {
      gs.setError("No item found.");
      this.exit(GameStateScene.EXIT);
      return;
    }
    this.item = item;
    this.updateBanner();
    this.showQuestion(this.item, this.hint, true);
  }

  /**
   * Set the displayed content.
   * @param item The base item to show.
   * @param hint If the hint should be displayed or not.
   * @param silent Set it to true to update the content but not render it.
   */
  showQuestion(item: Item, hint: boolean, silent = false) {
    const question = getOneSideText(gs.getSideA(item));
    const hintText = hint ? `(${this.hintStrategy.getHint(item)})` : "";
    const card = drawCard([question, hintText], getCardWidth(this.tWidth));
    this.setContent("card", card, silent);
  }

  /**
   * Show question and check answer.
   * Process is locked until the right answer is given (or _skip, or _exit is given).
   * Update date and error count in the question.
   * On "_hint", it shows additional hint.
   * On "_skip", it leaves the question.
   * On "_exit", quit earlier the questions process.
   */
  override readLine(answer: string): void {
    if (!this.item) {
      return;
    }
    this.updateBanner();
    const displayedQuestion = getOneSideText(gs.getSideA(this.item));
    const expected = getOneSideText(gs.getSideB(this.item));
    if (answer === "") {
      return;
    }
    if (answer === "_exit") {
      gs.setActiveScene(GameStateScene.RESULTS);
      return;
    }
    if (answer === "_hint") {
      this.hint = true;
      this.showQuestion(this.item, this.hint);
      return;
    }
    if (answer === "_skip") {
      this.addAnswer(displayedQuestion, "--skipped--", false);
      this.setContent("info", `=> ${expected}`);
      this.nextQuestion();
      return;
    }
    if (answer[0] === "_") {
      this.setContent("info", `This command is not valid.`);
      return;
    }
    const isCorrect = this.correctionStrategy.isCorrect(this.item, answer);
    this.addAnswer(displayedQuestion, answer, isCorrect);
    if (!isCorrect) {
      this.setContent("info", `WRONG !`);
      return;
    }
    this.setContent("info", `Correct :-)`);
    this.nextQuestion();
  }

  /**
   * Store the given answer and update revision statistics.
   * @private
   */
  private addAnswer(
    displayedQuestion: string,
    userAnswer: string,
    isCorrect: boolean,
  ) {
    if (!this.item) {
      return;
    }
    gs.addAnswers({
      displayedQuestion,
      userAnswer,
      item: this.item,
    });
    this.item.revision_count++;
    this.item.last_revision = this.now;
    if (!isCorrect) {
      this.item.errors_total++;
      this.item.errors_last++;
    }
  }

  /**
   * Show next question or shows results if the number of question exceed the limit.
   * @private
   */
  private nextQuestion() {
    const cardLimit = gs.getCardsLimit();
    gs.setQuestionIndex(gs.getQuestionIndex() + 1);
    const item = this.selectItem();
    if (!item || !cardLimit || gs.getQuestionIndex() >= cardLimit) {
      this.exit(GameStateScene.RESULTS);
      return;
    }
    this.item = item;
    this.item.errors_last = 0;
    this.hint = false;
    this.setContent("info", "", true);
    this.updateBanner();
    this.showQuestion(this.item, this.hint);
  }

  /**
   * Get random items via a strategy.
   * @private
   */
  private selectItem(): Item | null {
    const items = [...(gs.getSourceJson()?.items ?? [])];
    return this.selectionStrategy.selectItems(items, 1)[0] ?? null;
  }

  private updateBanner() {
    const gameMode = gs.getGameMode();
    const selectionStrategy = gs.getSelectionStrategy();
    const correctionStrategy = gs.getCorrectionStrategy();
    const hintStrategy = gs.getHintStrategy();
    const cardLimit = gs.getCardsLimit();
    const questionIndex = gs.getQuestionIndex();
    const lives = gs.getLivesRemaining();
    const hints = gs.getHintRemaining();
    const timeLimit = gs.getTimeLimit();
    const timeElapsed = gs.getTimeElapsed();
    const mode = `${gameMode} - ${selectionStrategy} - ${correctionStrategy} - ${hintStrategy}`;
    const game = `Q:${questionIndex + 1}/${cardLimit} - L:${lives} - H:${hints} - ${timeElapsed}/${timeLimit}`;
    this.setContent("mode", mode, true);
    this.setContent("game", game, true);
  }
}
