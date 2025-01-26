import { test, describe, vi, beforeAll, expect } from "vitest";
import { stdin } from "node:process";
import { CliLearningCards } from "./cli-learning-cards.js";

const consoleSpy = vi.spyOn(console, "log");
const getLastLog = () => `${consoleSpy.mock.lastCall}`;
/** @returns n previous log */
const getReverseLog = (reverseIndex: number) => {
  const n = consoleSpy.mock.calls.length - reverseIndex;
  return `${consoleSpy.mock.calls[n]}`;
};
const timeout = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

describe("Cli-learning-card", () => {
  beforeAll(() => {
    consoleSpy.mockClear();
  });

  test("The whole process", async () => {
    const clc = new CliLearningCards(
      new URL("../data/test.json", import.meta.url),
    );
    clc.run();
    expect(getLastLog().includes("Cli-learning-cards")).toBeTruthy();
    stdin.emit("keypress", null, { name: "enter" });
    await timeout(100);
    expect(getLastLog().includes("> Ten cards")).toBeTruthy();
    stdin.emit("keypress", null, { name: "up" });
    stdin.emit("keypress", null, { name: "up" });
    expect(getLastLog().includes("> Lives")).toBeTruthy();
    stdin.emit("keypress", null, { name: "enter" });
    await timeout(100);
    expect(getReverseLog(2).includes("test1")).toBeTruthy();
    //clc.getRl().write("_hint"); // why this doesn't work !!?
    clc.write("_hint");
    await timeout(100);
    clc.write("_");
    await timeout(100);
    expect(
      getReverseLog(2).includes("This command is not valid."),
    ).toBeTruthy();
    clc.write("_skip");
    await timeout(100);
    expect(getReverseLog(2).includes("test2")).toBeTruthy();
    clc.write("test2");
    await timeout(100);
    clc.write("_exit");
    expect(
      getReverseLog(2).includes("Do you want to save the results (y/n) ?"),
    ).toBeTruthy();
    clc.write("n");
    await timeout(100);
    expect(getReverseLog(2).includes("left unsaved.")).toBeTruthy();
    // Vitest doesn't like the "process.exit(0)" on close stream, skip the very end of the game;
    //clc.testRl("\n");
    //await timeout(100);
    //expect(getLastLog().includes("Bye")).toBeTruthy();
  });
});
