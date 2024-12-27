import { expect, test, describe } from "vitest";
import { getHint } from "./hint.js";

describe("utils", () => {
  test("getHint", () => {
    const result = getHint("abc bca cba acb");
    expect(result).toBe("abc abc abc abc");
  });
});
