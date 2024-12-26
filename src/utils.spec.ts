import { expect, test, describe } from "vitest";
import { parseItemDate } from "./utils.js";

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
});
