import { expect, test, describe } from "vitest";
import { ResultsScene } from "./results.js";
import { generateTestItems } from "../test-data.js";
import gs from "../game-state.js";

describe("ResultsScene", () => {
  const scene = new ResultsScene();

  test("getResults", () => {
    const items = generateTestItems(2);
    items[0]!.errors_last++;
    items.forEach((item) => {
      gs.addAnswers({
        item: item,
        userAnswer: gs.getSideB(item).main,
        displayedQuestion: gs.getSideA(item).main,
      });
    });
    const results = scene.getResults();
    expect(results).toEqual([
      "Perfectly known:",
      "front-1 - back-1 - back-1",
      "                 - back-var1-1",
      "",
      "To revise again:",
      "front-0 - back-0 - back-0",
      "                 - back-var1-0",
    ]);
  });
});
