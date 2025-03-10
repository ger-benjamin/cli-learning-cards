import { Scene } from "./scene.js";
import { parseJsonSource } from "../json-to-source.js";
import gs from "../game-state.js";
import { createRandomNumbers } from "../utils.js";
import listSelect from "./list-select.js";
import {
  CorrectionStrategies,
  GameMode,
  GameStateScene,
  HintStrategies,
  SelectionStrategies,
} from "../enums.js";

/**
 * A UI for the settings.
 */
export class SettingsScene extends Scene {
  private readonly noAnswer = "_noAnswer";
  private fetchingJson = true;

  constructor() {
    super();
    this.canWrite = false;
    this.content.set("load", "Loadings...");
    this.content.set("question", "");
    this.content.set("choices", "");
    this.content.set("info", "");
    if (!gs.getSourceJson()) {
      this.parseJson();
    }
  }

  /**
   * Read answers and set settings regarding the current state.
   * @param answer
   */
  override readLine(answer: string): void {
    if (this.fetchingJson || !gs.getSourceJson()) {
      return;
    }
    if (!gs.getGameMode()) {
      this.askGameMode();
      return;
    }
    const mode = gs.getGameMode()!;
    if (
      [
        GameMode.TEN_CARDS,
        GameMode.LIVES,
        GameMode.TIMED,
        GameMode.RANDOM,
      ].includes(mode)
    ) {
      this.setupPredefinedMode(mode);
      this.exit(GameStateScene.CARD);
      return;
    }
    if (mode === GameMode.FREE) {
      this.setupFreeMode(answer);
    }
  }

  /**
   * Clear the question / choices / info fields.
   * @private
   */
  private clearQuestion() {
    this.setContent("question", "", true);
    this.setContent("choices", "", true);
    this.setContent("info", "");
  }

  /**
   * Read the json data source amd throw error if it can't be handled.
   * @private
   */
  private async parseJson() {
    this.fetchingJson = true;
    const sourceJson = await parseJsonSource(gs.getSourcePath());
    if (!sourceJson || !sourceJson.items) {
      this.exit(GameStateScene.EXIT);
    }
    gs.setSourceJson(sourceJson);
    this.fetchingJson = false;
    this.content.delete("load");
    this.readLine(this.noAnswer);
  }

  /**
   * Setup settings-predefined mode (default is random)
   * @private
   */
  private setupPredefinedMode(mode: GameMode) {
    if (mode === GameMode.TEN_CARDS) {
      this.setupTenMode();
      return;
    }
    if (mode === GameMode.TIMED) {
      this.setupTimedMode();
      return;
    }
    if (mode === GameMode.LIVES) {
      this.setupLivesMode();
      return;
    }
    // else: Random
    this.setupRandomMode();
  }

  /**
   * Set up the "free settings" mode.
   * Asks for more settings.
   * @private
   */
  private setupFreeMode(answer: string) {
    if (gs.getQuestionIsFront() === null) {
      this.askQuestionIsFront();
      return;
    }
    if (gs.getTime() === null) {
      this.askAmountOfTime();
      return;
    }
    if (gs.getLivesRemaining() === null) {
      this.askNumberOfLives(answer);
      return;
    }
    if (gs.getHintRemaining() === null) {
      this.askNumberOfHints(answer);
      return;
    }
    if (gs.getCardsLimit() === null) {
      this.askNumberCards(answer);
      return;
    }
    gs.setCorrectionStrategy(CorrectionStrategies.Simple);
    gs.setHintStrategy(HintStrategies.SomeWords);
    gs.setSelectionStrategy(SelectionStrategies.RevisionDate);
    this.exit(GameStateScene.CARD);
  }

  /**
   * Set up the 10-cards quick mode (no time limit, no life limit, keep selected side).
   * @private
   */
  private setupTenMode() {
    gs.setTime(Infinity);
    gs.setLivesRemaining(Infinity);
    gs.setHintRemaining(Infinity);
    gs.setCardsLimit(10);
    gs.setCorrectionStrategy(CorrectionStrategies.Simple);
    gs.setHintStrategy(HintStrategies.SomeWords);
    gs.setSelectionStrategy(SelectionStrategies.RevisionDate);
    gs.setQuestionIsFront(Math.random() > 0.5);
  }

  /**
   * Set up the 3-lives quick mode (no time limit, no cards limits, changing side).
   * @private
   */
  private setupLivesMode() {
    gs.setTime(Infinity);
    gs.setLivesRemaining(3);
    gs.setHintRemaining(3);
    gs.setCardsLimit(Infinity);
    gs.setCorrectionStrategy(CorrectionStrategies.Simple);
    gs.setHintStrategy(HintStrategies.SomeWords);
    gs.setSelectionStrategy(SelectionStrategies.RevisionDate);
    gs.setQuestionIsFront(true);
    gs.setSideOfQuestionCanChange(true);
  }

  /**
   * Set up the time quick mode (3 minutes, no life limit, no cards limits, changing side).
   * @private
   */
  private setupTimedMode() {
    gs.setTime(180);
    gs.setLivesRemaining(Infinity);
    gs.setHintRemaining(Infinity);
    gs.setCardsLimit(Infinity);
    gs.setCorrectionStrategy(CorrectionStrategies.Simple);
    gs.setHintStrategy(HintStrategies.SomeWords);
    gs.setSelectionStrategy(SelectionStrategies.RevisionDate);
    gs.setQuestionIsFront(true);
    gs.setSideOfQuestionCanChange(true);
  }

  /**
   * Set up the random quick mode (Random settings).
   * @private
   */
  private setupRandomMode() {
    const random = createRandomNumbers();
    const getVal = (v: number) =>
      (v < random.length ? random[v] : random[0]) || 0;
    let timeLimit = getVal(0) < 5 ? 180 : Infinity;
    if (timeLimit !== Infinity) {
      timeLimit = getVal(1) < 5 ? 180 : 600;
    }
    gs.setTime(timeLimit);
    gs.setLivesRemaining(getVal(2) || Infinity);
    gs.setHintRemaining(getVal(3) || Infinity);
    let nbCards = getVal(4) * 4 || 10;
    if (timeLimit !== Infinity && getVal(4) % 2) {
      nbCards = Infinity;
    }
    gs.setCardsLimit(nbCards);
    gs.setCorrectionStrategy(CorrectionStrategies.Simple);
    gs.setHintStrategy(HintStrategies.SomeWords);
    gs.setSelectionStrategy(SelectionStrategies.Random);
    gs.setQuestionIsFront(getVal(0) < 5);
    gs.setSideOfQuestionCanChange(true);
  }

  /**
   * Show a list of available "GameMode"s and allow the user to select one of them.
   * @private
   */
  private askGameMode() {
    gs.setPauseStream(true);
    this.setContent("question", "What kind of game do you want to play?", true);
    const modes = Object.values(GameMode);
    this.setContent("choices", this.formatList(modes, modes[0] as string));
    const selectedChangeCb = (choices: string[]) => {
      gs.setGameMode(choices[0] as GameMode);
      this.exitQuestionCommon();
    };
    const cursorMoveCb = (choice: string) => {
      this.setContent("choices", this.formatList(modes, choice));
    };
    listSelect.listen(modes, selectedChangeCb, cursorMoveCb);
  }

  /**
   * Let the user choosing the side of the card to get the question from.
   * @private
   */
  private askQuestionIsFront() {
    gs.setPauseStream(true);
    this.setContent(
      "question",
      "Are the question from the front side (easier)?",
      true,
    );
    const possibilities: Record<string, string> = {
      "From the front": "true",
      "From the back": "false",
      Random: "random",
    };
    const possibilitiesTexts = Object.keys(possibilities);
    const firstChoice = possibilitiesTexts[0]!;
    this.setContent(
      "choices",
      this.formatList(possibilitiesTexts, firstChoice),
    );
    const selectedChangeCb = (choices: string[]) => {
      const choice = possibilities[choices[0]!];
      if (choice === "random") {
        gs.setQuestionIsFront(Math.random() > 0.5);
        gs.setSideOfQuestionCanChange(true);
        this.exitQuestionCommon();
      }
      gs.setQuestionIsFront(choice === "true");
      this.exitQuestionCommon();
    };
    const cursorMoveCb = (choice: string) => {
      this.setContent("choices", this.formatList(possibilitiesTexts, choice));
    };
    listSelect.listen(possibilitiesTexts, selectedChangeCb, cursorMoveCb);
  }

  /**
   * Show a list of available time limits settings and allow the user to select one of them.
   * @private
   */
  private askAmountOfTime() {
    gs.setPauseStream(true);
    this.setContent("question", "What's the time limit?", true);
    const possibilities: Record<string, number> = {
      Unlimited: Infinity,
      "1 minute": 60,
      "3 minutes": 180,
      "5 minutes": 600,
      "10 minutes": 600,
    };
    const possibilitiesTexts = Object.keys(possibilities);
    const firstChoice = possibilitiesTexts[0]!;
    this.setContent(
      "choices",
      this.formatList(possibilitiesTexts, firstChoice),
    );
    const selectedChangeCb = (choices: string[]) => {
      gs.setTime(possibilities[choices[0]!] ?? Infinity);
      this.exitQuestionCommon();
    };
    const cursorMoveCb = (choice: string) => {
      this.setContent("choices", this.formatList(possibilitiesTexts, choice));
    };
    listSelect.listen(possibilitiesTexts, selectedChangeCb, cursorMoveCb);
  }

  /**
   * Ask for a number of lives to start with (default 3).
   * @private
   */
  private askNumberOfLives(answer: string) {
    const exitQuestion = (lives: number) => {
      gs.setLivesRemaining(lives);
      this.exitQuestionCommon();
    };
    this.canWrite = true;
    const defaultNb = 3;
    const question = `How many lives do you want ? (default: ${defaultNb})`;
    this.setContent("question", question);
    if (answer === this.noAnswer) {
      return;
    }
    if (answer === "") {
      exitQuestion(defaultNb);
      return;
    }
    const lives = parseInt(answer);
    if (!lives || lives <= 0) {
      this.setContent(
        "info",
        "Please write a valid natural number bigger than 0",
      );
      return;
    }
    exitQuestion(lives);
  }

  /**
   * Ask for a number of hint to start with (default 5).
   * @private
   */
  private askNumberOfHints(answer: string) {
    const exitQuestion = (hints: number) => {
      gs.setHintRemaining(hints);
      this.exitQuestionCommon();
    };
    this.canWrite = true;
    const defaultNb = 5;
    const question = `How many hints do you want ? (default: ${defaultNb})`;
    this.setContent("question", question);
    if (answer === this.noAnswer) {
      return;
    }
    if (answer === "") {
      exitQuestion(defaultNb);
      return;
    }
    const hints = parseInt(answer);
    if (!hints) {
      this.setContent("info", "Please write a valid natural number.");
      return;
    }
    exitQuestion(hints);
  }

  /**
   * Ask for a number of cards to start with (default 10, max limited by the source).
   * @private
   */
  private askNumberCards(answer: string) {
    const exitQuestion = (cards: number) => {
      gs.setCardsLimit(cards);
      this.exitQuestionCommon();
    };
    this.canWrite = true;
    const defaultNb = 10;
    const max = gs.getSourceJson()?.items?.length ?? -1;
    const question = `How many cards do you want to train? (default ${defaultNb}, max ${max})`;
    this.setContent("question", question);
    if (answer === this.noAnswer) {
      return;
    }
    if (answer === "") {
      exitQuestion(defaultNb);
      return;
    }
    const cardsLimit = parseInt(answer);
    if (cardsLimit < 0 || cardsLimit > max) {
      this.setContent(
        "info",
        `Please write a valid natural number between 0 and ${max}`,
      );
      return;
    }
    exitQuestion(cardsLimit);
  }

  /**
   * Reset question and prepare for the next one.
   * @private
   */
  private exitQuestionCommon() {
    this.clearQuestion();
    this.canWrite = false;
    gs.setPauseStream(false);
    listSelect.unListen();
    this.readLine(this.noAnswer);
  }

  /**
   * Format (to display) a list of choices, and highlight the current choice.
   * @private
   */
  private formatList(list: string[], selected: string): string {
    const text = list.map((item) => {
      if (item === selected) {
        return `> ${item}`;
      }
      return `  ${item}`;
    });
    return text.join("\n");
  }
}
