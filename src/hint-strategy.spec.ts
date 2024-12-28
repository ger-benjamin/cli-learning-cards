import { expect, test, describe } from "vitest";
import gs from "./game-state.js";
import { generateTestItems } from "./test-data.js";
import { HintStrategy, HintStrategies } from "./hint-strategy.js";

describe("hint", () => {
  const strategy = new HintStrategy();
  const items = generateTestItems(1);

  test("sortLetters", () => {
    gs.setHintStrategy(HintStrategies.SortLetters);
    const item = items[0]!;
    item.card.back.main = "abc bca cba acb";
    item.card.back.variations = [];
    expect(strategy.getHint(item)).toEqual("abc abc abc abc");
  });

  test("someWords with only 2 words", () => {
    gs.setHintStrategy(HintStrategies.SomeWords);
    const item = items[0]!;
    item.card.back.main = "longest le";
    item.card.back.variations = [];
    expect(strategy.getHint(item)).toEqual("eglnost el");
  });

  test("someWords with more than 3 words", () => {
    gs.setHintStrategy(HintStrategies.SomeWords);
    const item = items[0]!;
    item.card.back.main = "la li lo lu longest le ly";
    item.card.back.variations = [];
    const result = strategy.getHint(item).split(" ");
    expect(result.length).toEqual(7);
    expect(result.includes("longest")).toBeFalsy();
    expect(result.filter((word) => word === "...").length).toBe(4);
    const firstRealWord = result.find((word) => word !== "...");
    expect(firstRealWord).toBeDefined();
    if (firstRealWord) {
      expect(firstRealWord[0]).toEqual("l");
    }
  });
});
