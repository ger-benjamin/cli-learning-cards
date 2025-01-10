import { expect, test, describe } from "vitest";
import { CorrectionStrategy } from "./correction-strategy.js";
import gs from "./game-state.js";
import { generateTestItems } from "./test-data.js";
import { CorrectionStrategies } from "./enums.js";

describe("CorrectionStrategy", () => {
  const strategy = new CorrectionStrategy();
  const items = generateTestItems(1);

  test("simple correction", () => {
    gs.setCorrectionStrategy(CorrectionStrategies.Simple);
    const item = items[0]!;
    item.card.back.main = "  .Test Simple-Correction ! ";
    expect(strategy.isCorrect(item, "test Simple-Correction")).toBeTruthy();
  });

  test("simple correction with variations", () => {
    gs.setCorrectionStrategy(CorrectionStrategies.Simple);
    const item = items[0]!;
    item.card.back.main = "Correction!";
    item.card.back.variations = ["Test s-c", "  .Test Simple-Correction ! "];
    expect(strategy.isCorrect(item, "test Simple-Correction")).toBeTruthy();
  });
});
