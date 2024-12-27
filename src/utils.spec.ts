import { expect, test, describe } from "vitest";
import { parseItemDate, getOneSideText, getSideTexts } from "./utils.js";
import { generateTestItems } from "./test-data.js";

describe("utils", () => {
  test("parseItemDate", () => {
    const now = new Date();
    let result = parseItemDate("test string valid", "2024-12-26T13:09:22.416Z");
    expect(result.getDate()).toBe(26);
    result = parseItemDate("test string valid", now);
    expect(result.getDate()).toBe(now.getDate());
    result = parseItemDate(
      "test string not valide",
      "2024-123456-26T13:09:22.416Z",
    );
    expect(result.getDate()).toBe(now.getDate());
  });

  test("getSideTexts", () => {
    const item = generateTestItems(1)[0]!;
    item.card.front.key = "a";
    item.card.front.variations = ["b", "c", "d", "e"];
    const texts = getSideTexts(item.card.front);
    expect(texts.length).toBe(5);
    expect(texts).toEqual(["a", "b", "c", "d", "e"]);
  });

  test("getOneSideText", () => {
    const item = generateTestItems(1)[0]!;
    item.card.front.key = "a";
    item.card.front.variations = ["b", "c", "d", "e"];
    const result = Array(5)
      .fill(null)
      .map(() => getOneSideText(item.card.front))
      .join("");
    expect(result.length).toBe(5);
    // Probabily for false positive are 1/3125.
    expect(result).not.toBe("aaaaa");
    expect(result).not.toBe("bbbbb");
    expect(result).not.toBe("ccccc");
    expect(result).not.toBe("ddddd");
    expect(result).not.toBe("eeeee");
  });
});
