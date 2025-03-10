import { Scene } from "./scene.js";
import type { Item } from "../source-json.js";
import { HintStrategy } from "../hint-strategy.js";
import { getOneSideText } from "../utils.js";
import gs from "../game-state.js";
import { CorrectionStrategy } from "../correction-strategy.js";
import { drawCard } from "./draw-card.js";
import { getCardWidth } from "./card-utils.js";
import { SelectionStrategy } from "../selection-strategy.js";
import { Colors, GameStateScene } from "../enums.js";
import { colorize } from "./colorize-card.js";
import { emojify } from "node-emoji";

/**
 * A UI for cards questions.
 */
export class CardScene extends Scene {
  private readonly hintStrategy = new HintStrategy();
  private readonly correctionStrategy = new CorrectionStrategy();
  private readonly selectionStrategy = new SelectionStrategy();
  private readonly now = new Date();
  private countDownIntervalFn: NodeJS.Timeout | null = null;
  private countDownSeconds = 5;
  private item: Item | null = null;
  private hint = false;

  constructor() {
    super();
    this.content.set("mode", "");
    this.content.set("game", "");
    this.content.set("card", "");
    this.content.set("info", "");
  }

  override start() {
    super.start();
    const item = this.selectItem();
    if (!item) {
      gs.setError("No item found.");
      this.exit(GameStateScene.EXIT);
      return;
    }
    this.item = item;
    this.showQuestion(this.item, this.hint);
    if (gs.getTime() !== Infinity) {
      this.countDownIntervalFn = setInterval(
        this.countDown.bind(this),
        this.countDownSeconds * 1000,
      );
    }
  }

  /**
   * Exit to next scene and cancel debounce.
   */
  override exit(scene: GameStateScene) {
    if (this.countDownIntervalFn) {
      clearInterval(this.countDownIntervalFn);
    }
    super.exit(scene);
  }

  /**
   * Set the displayed content.
   * @param item The base item to show.
   * @param hint If the hint should be displayed or not.
   */
  showQuestion(item: Item, hint: boolean) {
    this.updateBanner();
    const question = getOneSideText(gs.getSideA(item));
    const hintText = hint ? `(${this.hintStrategy.getHint(item)})` : "";
    const card = drawCard([question, hintText], getCardWidth(this.tWidth));
    this.setContent("card", colorize(card));
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
    const displayedQuestion = getOneSideText(gs.getSideA(this.item));
    const expected = getOneSideText(gs.getSideB(this.item));
    if (answer === "") {
      return;
    }
    if (answer === "_exit") {
      this.exit(GameStateScene.RESULTS);
      return;
    }
    if (answer === "_hint") {
      if (this.hint) {
        this.showQuestion(this.item, this.hint);
        return;
      }
      let hintRemaining = gs.getHintRemaining() ?? 0;
      if (hintRemaining < 1) {
        this.setContent("info", `No more hints.`);
        return;
      }
      hintRemaining--;
      gs.setHintRemaining(hintRemaining);
      this.hint = true;
      this.showQuestion(this.item, this.hint);
      return;
    }
    if (answer === "_skip") {
      this.handleAnswer(displayedQuestion, "--skipped--", false);
      this.setContent("info", `=> ${expected}`);
      this.nextQuestion();
      return;
    }
    if (answer[0] === "_") {
      this.setContent("info", `This command is not valid.`);
      return;
    }
    const isCorrect = this.correctionStrategy.isCorrect(this.item, answer);
    this.handleAnswer(displayedQuestion, answer, isCorrect);
    if (!isCorrect) {
      gs.setCardColor(Colors.Red);
      gs.setLivesRemaining((gs.getLivesRemaining() ?? 1) - 1);
      this.showQuestion(this.item, this.hint);
      this.checkEnd(this.item);
      return;
    }
    this.nextQuestion();
  }

  /**
   * Store the given answer and update revision statistics.
   * @private
   */
  private handleAnswer(
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
    this.item.last_revision = this.now;
    if (isCorrect) {
      this.item.revision_count++;
    } else {
      this.item.errors_total++;
      this.item.errors_last++;
    }
  }

  /**
   * Show next question or shows results if the number of question exceed the limit.
   * Can change (20%) the side of the question if it's authorised.
   * @private
   */
  private nextQuestion() {
    gs.setCardColor(Colors.Blue);
    gs.setQuestionIndex(gs.getQuestionIndex() + 1);
    const item = this.selectItem();
    if (this.checkEnd(item)) {
      return;
    }
    // 20% chance of changing the question side if authorised.
    if (gs.getSideOfQuestionCanChange() && Math.random() < 0.2) {
      gs.setQuestionIsFront(!gs.getQuestionIsFront());
    }
    this.item = item!;
    this.item.errors_last = 0;
    this.hint = false;
    this.setContent("info", "", true);
    this.showQuestion(this.item, this.hint);
  }

  /**
   * Check for the end of the game
   * @returns true if the game is over.
   * @private
   */
  private checkEnd(item: Item | null): boolean {
    if ((gs.getLivesRemaining() ?? -1) <= 0) {
      this.exit(GameStateScene.RESULTS);
      return true;
    }
    const cardLimit = gs.getCardsLimit();
    if (!item || !cardLimit || gs.getQuestionIndex() >= cardLimit) {
      gs.setCardColor(Colors.Blue);
      this.exit(GameStateScene.RESULTS);
      return true;
    }
    return false;
  }

  /**
   * Get random items via a strategy.
   * @private
   */
  private selectItem(): Item | null {
    const items = [...(gs.getSourceJson()?.items ?? [])];
    return this.selectionStrategy.selectItems(items, 1)[0] ?? null;
  }

  /**
   * Updates the time (count down) and restarts auto call
   * this function again after a delay (given by countDownSeconds).
   * @private
   */
  private countDown() {
    const time = gs.getTime() ?? 0;
    if (time <= 0) {
      this.exit(GameStateScene.RESULTS);
      return;
    }
    gs.setTime(time - this.countDownSeconds);
    // Under a limit, re-call this function more frequently.
    if (time - this.countDownSeconds <= 15) {
      clearInterval(this.countDownIntervalFn!);
      this.countDownSeconds = 1;
      this.countDownIntervalFn = setInterval(
        this.countDown.bind(this),
        this.countDownSeconds * 1000,
      );
    }
    this.updateBanner();
  }

  /**
   * Generate and print a "game-settings" banner, to let the user know
   * the current settings and some game states.
   * @private
   */
  private updateBanner() {
    const gameMode = gs.getGameMode();
    const selectionStrategy = gs.getSelectionStrategy();
    const correctionStrategy = gs.getCorrectionStrategy();
    const hintStrategy = gs.getHintStrategy();
    const mode = `${gameMode} - ${selectionStrategy} - ${correctionStrategy} - ${hintStrategy}`;
    const gameInfos: string[] = [];
    const cardLimit = gs.getCardsLimit();
    const questionIndex = gs.getQuestionIndex();
    const lives = gs.getLivesRemaining();
    const hints = gs.getHintRemaining();
    const time = gs.getTime();
    let questionCounter = emojify(`:books::${questionIndex + 1}`);
    if (cardLimit !== Infinity) {
      questionCounter = `${questionCounter}/${cardLimit}`;
    }
    gameInfos.push(questionCounter);
    if (lives !== Infinity) {
      gameInfos.push(emojify(`:heart: :${lives}`));
    }
    if (hints !== Infinity) {
      gameInfos.push(emojify(`:bulb::${hints}`));
    }
    if (time !== Infinity) {
      gameInfos.push(emojify(`:hourglass_flowing_sand::${time}`));
    }
    this.setContent("mode", mode, true);
    this.setContent("game", gameInfos.join(" - "), false);
  }
}
