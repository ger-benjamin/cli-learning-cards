import { expect, test, describe } from "vitest";
import {
  splitKeep,
  splitText,
  getLimitedSizeLines,
  drawCard,
} from "./draw-card.js";

describe("draw-card", () => {
  test("splitKeep", () => {
    expect(splitKeep("my-long-text", "-")).toEqual(["my-", "long-", "text"]);
  });

  test("splitText", () => {
    const text = "my-long-text very long";
    expect(splitText(text, 10)).toEqual([
      "my-",
      "long-",
      "text ",
      "very ",
      "long",
    ]);
    expect(splitText(text, 13)).toEqual(["my-long-text ", "very ", "long"]);
  });

  test("getLimitedSizeLines with few letters", () => {
    const result = getLimitedSizeLines("ab cd", 12);
    expect(result).toEqual(["ab cd"]);
  });

  test("getLimitedSizeLines with a lot of letters", () => {
    const result = getLimitedSizeLines("ab cd efg hijk lmnop", 12);
    expect(result).toEqual(["ab cd efg ", "hijk lmnop"]);
  });

  test("getLimitedSizeLines with a lot of letters and multi separator", () => {
    const result = getLimitedSizeLines("ab cdefghijk-lmnop", 12);
    expect(result).toEqual(["ab ", "cdefghijk-", "lmnop"]);
  });

  test("getLimitedSizeLines with a lot of letters without separator", () => {
    const result = getLimitedSizeLines("abcdefghijklmnop", 12);
    expect(result).toEqual(["abcdefghijk", "lmnop"]);
  });

  test("drawCard", () => {
    const result = drawCard(["title", "very-very-very-long-title"], 20);
    expect(result).toEqual(`
--------------------
|                  |
|                  |
|      title       |
|                  |
| very-very-very-  |
|    long-title    |
|                  |
|                  |
--------------------`);
  });
});
