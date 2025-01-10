import { expect, test, describe } from "vitest";
import { SelectionStrategy } from "./selection-strategy.js";
import gs from "./game-state.js";
import { generateTestItems } from "./test-data.js";
import { SelectionStrategies } from "./enums.js";

describe("SelectionStrategy", () => {
  const strategy = new SelectionStrategy();
  const items = generateTestItems(3);

  test("selectItemsByDate", () => {
    gs.setSelectionStrategy(SelectionStrategies.RevisionDate);
    items[0]?.last_revision.setDate(10);
    items[1]?.last_revision.setDate(11);
    items[2]?.last_revision.setDate(8);
    const selectedItems = strategy.selectItems(items, 2);
    expect(selectedItems.length).toBe(2);
    expect(selectedItems[0]?.id).toBe("2");
    expect(selectedItems[1]?.id).toBe("0");
  });
});
