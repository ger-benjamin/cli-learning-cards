import { expect, test, describe } from "vitest";
import { parseItemDate, fromAnyItemToItem } from "./json-to-source.js";

describe("json-to-source", () => {
  test("parseItemDate", () => {
    const now = new Date();
    let result = parseItemDate("test string valid", "2024-12-26T13:09:22.416Z");
    expect(result.getDate()).toBe(26);
    result = parseItemDate("test string valid", now);
    expect(result.getDate()).toBe(now.getDate());
    result = parseItemDate(
      "test string not valid",
      "2024-123456-26T13:09:22.416Z",
    );
    expect(result.getDate()).toBe(now.getDate());
  });

  test("fromAnyItemToItem not valid input", () => {
    const anyItem = {
      id: "testId",
      card: {
        back: { main: "testBackMain" },
      },
    };
    expect(() => fromAnyItemToItem(anyItem, 0)).toThrowError("source json");
  });

  test("fromAnyItemToItem minimalistic input", () => {
    const now = new Date();
    const result = fromAnyItemToItem(
      {
        id: "testId",
        card: {
          front: { main: "testFrontMain" },
          back: { main: "testBackMain" },
        },
      },
      0,
    );
    expect(result).toBeDefined();
    expect(result.id).toBe("testId");
    expect(result.card.front.main).toBe("testFrontMain");
    expect(result.card.front.variations).toEqual([]);
    expect(result.card.back.main).toBe("testBackMain");
    expect(result.card.back.variations).toEqual([]);
    expect(result.last_revision.getDate()).toEqual(now.getDate());
    expect(result.categories).toEqual([]);
    expect(result.revision_count).toBe(0);
    expect(result.favorite_lvl).toBe(0);
    expect(result.errors_last).toBe(0);
    expect(result.errors_total).toBe(0);
  });

  test("fromAnyItemToItem complete input", () => {
    const date = new Date();
    date.setDate(31);
    const result = fromAnyItemToItem(
      {
        id: "testId",
        card: {
          front: { main: "testFrontMain", variations: ["testFrontVar"] },
          back: { main: "testBackMain", variations: ["testBackVar"] },
        },
        last_revision: date,
        categories: ["cat1"],
        revision_count: 1,
        favorite_lvl: 2,
        errors_last: 3,
        errors_total: 4,
      },
      0,
    );
    expect(result).toBeDefined();
    expect(result.id).toBe("testId");
    expect(result.card.front.main).toBe("testFrontMain");
    expect(result.card.front.variations).toEqual(["testFrontVar"]);
    expect(result.card.back.main).toBe("testBackMain");
    expect(result.card.back.variations).toEqual(["testBackVar"]);
    expect(result.last_revision).toEqual(date);
    expect(result.categories).toEqual(["cat1"]);
    expect(result.revision_count).toBe(1);
    expect(result.favorite_lvl).toBe(2);
    expect(result.errors_last).toBe(3);
    expect(result.errors_total).toBe(4);
  });
});
