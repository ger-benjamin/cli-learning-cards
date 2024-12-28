import type { Item, Side } from "./source-json.js";
import { SelectionStrategies } from "./selection-strategy.js";
import { CorrectionStrategies } from "./correction-strategy.js";
import { HintStrategies } from "./hint-strategy.js";
import type { Answer } from "./game-state-types.js";

/**
 * Represents the currents state of a game.
 * Should be used as singleton.
 */
class GameState {
  private gameStopped = false;
  private questionIsFront = true;
  private selectionStrategy: SelectionStrategies;
  private correctionStrategy: CorrectionStrategies;
  private hintStrategy: HintStrategies;
  private answers: Answer[] = [];

  constructor() {
    this.selectionStrategy = "random" as SelectionStrategies;
    this.correctionStrategy = "Simple" as CorrectionStrategies;
    this.hintStrategy = "sortLetters" as HintStrategies;
  }

  isGameStopped(): boolean {
    return this.gameStopped;
  }

  stopGame() {
    this.gameStopped = true;
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
   * Get the "side" of a an item card.
   * if it's the "front", then the "side B" will be the back, and vice-versa.
   * */
  getSideA(item: Item): Side {
    if (this.questionIsFront) {
      return item.card.front;
    } else {
      return item.card.back;
    }
  }

  /**
   * Get a "side" of a an item card.
   * if it's the "front", then the "side A" will be the back, and vice-versa.
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
