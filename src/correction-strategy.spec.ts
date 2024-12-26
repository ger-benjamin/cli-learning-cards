import { expect, test, describe } from "vitest";
import {
  CorrectionStrategy,
  CorrectionStrategies,
} from "./correction-strategy.js";
import gs from "./game-state.js";
import { generateTestItems } from "./test-data.js";

describe("CorrectionStrategy", () => {
  const strategy = new CorrectionStrategy();
  const items = generateTestItems(1);

  test("simple correction", () => {
    gs.setCorrectionStrategy(CorrectionStrategies.Simple);
    const item = items[0]!;
    item.card.back.key = "  .Test Simple-Correction ! ";
    expect(strategy.isCorrect(item, "test Simple-Correction")).toBeTruthy();
  });
});
