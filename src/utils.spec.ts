import { expect, test, describe } from "vitest";
import { getOneSideText, getSideTexts } from "./utils.js";
import { generateTestItems } from "./test-data.js";

describe("utils", () => {
  test("getSideTexts", () => {
    const item = generateTestItems(1)[0]!;
    item.card.front.main = "a";
    item.card.front.variations = ["b", "c", "d", "e"];
    const texts = getSideTexts(item.card.front);
    expect(texts.length).toBe(5);
    expect(texts).toEqual(["a", "b", "c", "d", "e"]);
  });

  test("getOneSideText", () => {
    const item = generateTestItems(1)[0]!;
    item.card.front.main = "a";
    item.card.front.variations = ["b", "c", "d", "e"];
    const result = Array(5)
      .fill(null)
      .map(() => getOneSideText(item.card.front))
      .join("");
    expect(result.length).toBe(5);
    // The probability for false positive is 1/3125.
    expect(result).not.toBe("aaaaa");
    expect(result).not.toBe("bbbbb");
    expect(result).not.toBe("ccccc");
    expect(result).not.toBe("ddddd");
    expect(result).not.toBe("eeeee");
  });
});
