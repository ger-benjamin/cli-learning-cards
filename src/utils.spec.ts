import { expect, test, describe } from "vitest";
import {
  getOneSideText,
  getSideTexts,
  lowerFirst,
  takeMultipleRandomly,
  takeOneRandomly,
} from "./utils.js";
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

  test("lowerFirst", () => {
    expect(lowerFirst("Toto Tata")).toBe("toto Tata");
    expect(lowerFirst("cECI")).toBe("cECI");
  });

  test("takeOneRandomly", () => {
    let array = [0, 1, 2, 3, 4];
    let result = takeOneRandomly(array);
    expect(result).toBeDefined();
    expect(array.includes(result!));

    array = [1];
    result = takeOneRandomly(array);
    expect(result).toBe(1);

    array = [];
    result = takeOneRandomly(array);
    expect(result).toBeUndefined();
  });

  test("takeMultipleRandomly", () => {
    const array = [0, 1, 2, 3, 4];
    let result = takeMultipleRandomly(array, 3);
    expect(result).toBeDefined();
    expect(result!.length).toBe(3);
    const uniq = new Set(result);
    expect(uniq.size).toBe(3);
    result!.forEach((item) => expect(array.includes(item)));

    result = takeMultipleRandomly(array, 20);
    expect(result!.length).toBe(5);

    result = takeMultipleRandomly(array, 0);
    expect(result!.length).toBe(0);

    result = takeMultipleRandomly([], 5);
    expect(result!.length).toBe(0);
  });
});
