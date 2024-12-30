import { CorrectionStrategy } from "../correction-strategy.js";
import gs, { GameStateScene } from "../game-state.js";
import { getOneSideText } from "../utils.js";
import type { InputEntry } from "./input-entry.js";

export class CardIE implements InputEntry {
  private readonly correctionStrategy = new CorrectionStrategy();
  private readonly now = new Date();

  /**
   * Show question and check answer.
   * Process is locked until the right answer is given.
   * Update date and error count in the question.
   * On "_hint", it shows additional hint.
   * On "_skip", it leaves the question.
   * On "_exit", quit earlier the questions process.
   */
  readLine(answer: string): void {
    const item = gs.getCurrentCardItem().getValue();
    if (!item) {
      console.error("no item ? how ?");
      gs.setActiveScene(GameStateScene.EXIT);
      return;
    }
    const question = getOneSideText(gs.getSideA(item));
    const expected = getOneSideText(gs.getSideB(item));
    if (answer === "") {
      return;
    }
    if (answer === "_exit") {
      gs.setActiveScene(GameStateScene.RESULTS);
      return;
    }
    if (answer === "_skip") {
      console.log(`=> ${expected}\n`);
      this.nextQuestion();
      return;
    }
    if (answer === "_hint") {
      gs.setShowHint(true);
      return;
    }
    if (answer[0] === "_") {
      console.log(`This command is not valid.\n`);
      return;
    }
    gs.addAnswers({
      answer,
      question,
      id: item.id,
    });
    const valid = this.correctionStrategy.isCorrect(item, answer);
    if (!valid) {
      item.errors_total++;
      item.errors_last++;
      console.log("FAUX !");
      return;
    }
    item.revision_count++;
    item.last_revision = this.now;
    console.log(`Correct :-)\n`);
    this.nextQuestion();
  }

  private nextQuestion() {
    gs.setQuestionIndex(gs.getQuestionIndex() + 1);
    if (gs.getQuestionIndex() >= gs.getCardsLimit()) {
      gs.setActiveScene(GameStateScene.RESULTS);
      return;
    }
    const item = gs.getSelectedItems()[gs.getQuestionIndex()]!;
    item.errors_last = 0;
    gs.setCurrentCardItem(item);
  }
}
