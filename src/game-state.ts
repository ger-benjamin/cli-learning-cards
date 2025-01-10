import type { Item, Side, SourceJson } from "./source-json.js";
import type { Answer } from "./game-state-types.js";
import { EventValue } from "./event.js";
import { GameMode } from "./enums.js";
import {
  CorrectionStrategies,
  GameStateScene,
  HintStrategies,
  SelectionStrategies,
} from "./enums.js";

/**
 * Represents the currents state of a game.
 * Should be used as singleton.
 */
class GameState {
  private pauseStream = false;
  private activeScene = new EventValue<GameStateScene>();
  private selectionStrategy: SelectionStrategies;
  private correctionStrategy: CorrectionStrategies;
  private hintStrategy: HintStrategies;
  private answers: Answer[] = [];
  private sourcePath: URL | null = null;
  private sourceJson: SourceJson | null = null;
  private selectedItems: Item[] = [];
  private gameMode: GameMode | null = null;
  private cardsLimit: number | null = null;
  private timeElapsed = 0;
  private timeLimit: number | null = null;
  private hintRemaining: number | null = null;
  private livesRemaining: number | null = null;
  private questionIsFront = true;

  private questionIndex = 0;
  private error = new EventValue<string>();

  constructor() {
    this.selectionStrategy = SelectionStrategies.Random;
    this.correctionStrategy = CorrectionStrategies.Simple;
    this.hintStrategy = HintStrategies.SortLetters;
  }

  getPauseStream(): boolean {
    return this.pauseStream;
  }

  setPauseStream(pause: boolean) {
    return (this.pauseStream = pause);
  }

  getActiveScene(): EventValue<GameStateScene> {
    return this.activeScene;
  }

  setActiveScene(value: GameStateScene) {
    this.activeScene.setValue(value);
  }

  getGameMode(): GameMode | null {
    return this.gameMode;
  }

  setGameMode(value: GameMode | null) {
    this.gameMode = value;
  }

  getTimeElapsed(): number {
    return this.timeElapsed;
  }

  setTimeElapsed(value: number) {
    this.timeElapsed = value;
  }

  getTimeLimit(): number | null {
    return this.timeLimit;
  }

  setTimeLimit(value: number) {
    this.timeLimit = value;
  }

  getHintRemaining(): number | null {
    return this.hintRemaining;
  }

  setHintRemaining(value: number) {
    this.hintRemaining = value;
  }

  getLivesRemaining(): number | null {
    return this.livesRemaining;
  }

  setLivesRemaining(value: number) {
    this.livesRemaining = value;
  }

  getError(): EventValue<string> {
    return this.error;
  }

  setError(error: string) {
    this.error.setValue(error);
  }

  getSourcePath(): URL {
    return this.sourcePath ?? new URL("json", "path-must-be-set");
  }

  setSourcePath(sourcePath: URL) {
    this.sourcePath = sourcePath;
  }

  getSourceJson(): SourceJson | null {
    return this.sourceJson;
  }

  setSourceJson(sourceJson: SourceJson | null) {
    this.sourceJson = sourceJson;
  }

  getSelectedItems(): Item[] {
    return this.selectedItems;
  }

  setSelectedItems(items: Item[]) {
    this.selectedItems = items;
  }

  getCardsLimit(): number | null {
    return this.cardsLimit;
  }

  setCardsLimit(limit: number) {
    this.cardsLimit = limit;
  }

  getQuestionIndex(): number {
    return this.questionIndex;
  }

  setQuestionIndex(index: number) {
    this.questionIndex = index;
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

  getAnswers(): Answer[] {
    return this.answers;
  }

  addAnswers(answer: Answer) {
    return this.answers.push(answer);
  }

  setQuestionIsFront(value: boolean) {
    this.questionIsFront = value;
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
const gameState = new GameState();
export default gameState;
