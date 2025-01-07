import type { Side, Item, SourceJson } from "./source-json.js";
import type { Answer } from "./game-state-types.js";
import { SelectionStrategies } from "./selection-strategy.js";
import { CorrectionStrategies } from "./correction-strategy.js";
import { HintStrategies } from "./hint-strategy.js";
import { EventValue } from "./event.js";

export const enum GameStateScene {
  SPLASH_SCREEN = "splash-screen",
  SETTINGS = "settings",
  CARD = "card",
  RESULTS = "results",
  EXIT = "exit",
  NO_SCENE = "no_scene",
}

/**
 * Represents the currents state of a game.
 * Should be used as singleton.
 */
class GameState {
  private activeScene = new EventValue<GameStateScene>();
  private selectionStrategy: SelectionStrategies;
  private correctionStrategy: CorrectionStrategies;
  private hintStrategy: HintStrategies;
  private questionIsFront = true;
  private answers: Answer[] = [];
  private sourcePath: URL | null = null;
  private sourceJson: SourceJson | null = null;
  private selectedItems: Item[] = [];
  private cardsLimit = 0;
  private questionIndex = 0;
  private error = new EventValue<string>();

  constructor() {
    this.selectionStrategy = "random" as SelectionStrategies;
    this.correctionStrategy = "Simple" as CorrectionStrategies;
    this.hintStrategy = "sortLetters" as HintStrategies;
  }

  setActiveScene(value: GameStateScene) {
    this.activeScene.setValue(value);
  }

  getActiveScene(): EventValue<GameStateScene> {
    return this.activeScene;
  }

  setError(error: string) {
    this.error.setValue(error);
  }

  getError(): EventValue<string> {
    return this.error;
  }

  setSourcePath(sourcePath: URL) {
    this.sourcePath = sourcePath;
  }

  getSourcePath(): URL {
    return this.sourcePath ?? new URL("json", "path-must-be-set");
  }

  setSourceJson(sourceJson: SourceJson | null) {
    this.sourceJson = sourceJson;
  }

  getSourceJson(): SourceJson | null {
    return this.sourceJson;
  }

  setSelectedItems(items: Item[]) {
    this.selectedItems = items;
  }

  getSelectedItems(): Item[] {
    return this.selectedItems;
  }

  setCardsLimit(limit: number) {
    this.cardsLimit = limit;
  }

  getCardsLimit(): number {
    return this.cardsLimit;
  }

  setQuestionIndex(index: number) {
    this.questionIndex = index;
  }

  getQuestionIndex(): number {
    return this.questionIndex;
  }

  getSelectionStrategy(): SelectionStrategies {
    return this.selectionStrategy;
  }

  setSelectionStrategy(value: SelectionStrategies) {
    this.selectionStrategy = value;
  }

  getCorrectionStrategy(): CorrectionStrategies {
    return this.correctionStrategy;
  }

  setCorrectionStrategy(value: CorrectionStrategies) {
    this.correctionStrategy = value;
  }

  getHintStrategy(): HintStrategies {
    return this.hintStrategy;
  }

  setHintStrategy(value: HintStrategies) {
    this.hintStrategy = value;
  }

  setQuestionIsFront(value: boolean) {
    this.questionIsFront = value;
  }

  getAnswers(): Answer[] {
    return this.answers;
  }

  addAnswers(answer: Answer) {
    return this.answers.push(answer);
  }

  /**
   * Get the "side" of an item card.
   * if it's the "front", then the "side B" will be the back, and vice versa.
   * */
  getSideA(item: Item): Side {
    if (this.questionIsFront) {
      return item.card.front;
    } else {
      return item.card.back;
    }
  }

  /**
   * Get a "side" of an item card.
   * if it's the "front", then the "side A" will be the back, and vice versa.
   */
  getSideB(item: Item): Side {
    if (this.questionIsFront) {
      return item.card.back;
    } else {
      return item.card.front;
    }
  }
}

/** State exported as singleton. */
const gameSettings = new GameState();
export default gameSettings;
