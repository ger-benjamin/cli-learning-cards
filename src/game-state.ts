import type { Item, Side, SourceJson } from "./source-json.js";
import type { Answer } from "./game-state-types.js";
import { EventValue } from "./event.js";
import {
  Colors,
  CorrectionStrategies,
  GameMode,
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
  private cardColor: Colors = Colors.Blue;
  private gameMode: GameMode | null = null;
  private cardsLimit: number | null = null;
  private time: number | null = null;
  private hintRemaining: number | null = null;
  private livesRemaining: number | null = null;
  private questionIsFront: boolean | null = null;
  private sideOfQuestionCanChange = false;

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

  getCardColor(): Colors {
    return this.cardColor;
  }

  setCardColor(color: Colors) {
    this.cardColor = color;
  }

  getGameMode(): GameMode | null {
    return this.gameMode;
  }

  setGameMode(value: GameMode | null) {
    this.gameMode = value;
  }

  getTime(): number | null {
    return this.time;
  }

  setTime(value: number) {
    this.time = value;
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

  /**
   * @returns if the question is from the front or on the back side. Replying
   * to the front (questionIsFront = true) is considered as easier.
   */
  getQuestionIsFront(): boolean | null {
    return this.questionIsFront;
  }

  /**
   * Set the side of the question, side "front" is considered as easier.
   * Set also the color to bright (front) or normal (back);
   */
  setQuestionIsFront(value: boolean) {
    this.questionIsFront = value;
  }

  /**
   * @returns if the side of the question can change or not.
   */
  getSideOfQuestionCanChange(): boolean {
    return this.sideOfQuestionCanChange;
  }

  /**
   * Set the possibility of the question to change the "side" origin.
   */
  setSideOfQuestionCanChange(canChange: boolean) {
    this.sideOfQuestionCanChange = canChange;
  }

  /**
   * Get the "side" of an item card.
   * if it's the "front", then the "side B" will be the back, and vice versa.
   * */
  getSideA(item: Item): Side {
    if (this.questionIsFront !== false) {
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
    if (this.questionIsFront !== false) {
      return item.card.back;
    } else {
      return item.card.front;
    }
  }
}

/** State exported as singleton. */
const gameState = new GameState();
export default gameState;
