import type { Item, Side } from "./source-json.js";

class GameState {
  private questionIsFront: boolean = true;

  constructor() {}

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

const gameSettings = new GameState();
export default gameSettings;
