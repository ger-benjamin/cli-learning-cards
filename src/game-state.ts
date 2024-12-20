import type { Item, Side } from "./source-json.js";
import { SelectionStrategies } from "./selection-strategy.js";
import { CorrectionStrategies } from "./correction-strategy.js";

/**
 * Represents the currents state of a game.
 * Should be used as singleton.
 */
class GameState {
  private questionIsFront: boolean = true;
  private selectionStrategy: SelectionStrategies = SelectionStrategies.Date;
  private correctionStrategy: CorrectionStrategies =
    CorrectionStrategies.Simple;

  constructor() {}

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

  setQuestionIsFront(value: boolean) {
    this.questionIsFront = value;
  }

  getQuestion(item: Item): Side {
    if (this.questionIsFront) {
      return item.card.front;
    } else {
      return item.card.back;
    }
  }

  getAnswer(item: Item): Side {
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
