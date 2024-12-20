import { expect, test, describe } from "vitest";
import {
  CorrectionStrategy,
  CorrectionStrategies,
} from "./correction-strategy.js";
import gs from "./game-state.js";
import { generateTestItems } from "./test-data.js";
import type { Item } from "./source-json.js";

describe("CorrectionStrategy", () => {
  const strategy = new CorrectionStrategy();
  const items = generateTestItems(1);

  test("simple correction", () => {
    console.log(CorrectionStrategies.Simple);
    const item = { ...items[0] } as Item;
    item.card.back.key = "  .Test Simple-Correction ! ";
    gs.setCorrectionStrategy(CorrectionStrategies.Simple);
    expect(strategy.isCorrect(item, "test Simple-Correction")).toBeTruthy();
  });
});
