import { writeFileSync } from "node:fs";
import type { InputEntry } from "./input-entry.js";
import gs, { GameStateScene } from "../game-state.js";

export class ResultsIE implements InputEntry {
  private readonly sourcePath: URL;

  constructor(sourcePath: URL) {
    this.sourcePath = sourcePath;
  }

  readLine(answer: string) {
    this.saveResults(answer);
  }

  /**
   * Update source file with results.
   * @private
   */
  saveResults(answer: string) {
    if (!["yes", "y", "1", "true", "t"].includes(answer.toLowerCase())) {
      console.log("No results saved.");
      gs.setActiveScene(GameStateScene.EXIT);
      return;
    }
    const revisedItemsIds = gs.getSelectedItems().map((item) => item.id);
    const notRevisedItems =
      gs
        .getSourceJson()
        ?.items.filter((item) => !revisedItemsIds.includes(item.id)) ?? [];
    const newItems = [...gs.getSelectedItems(), ...notRevisedItems];
    writeFileSync(
      this.sourcePath,
      JSON.stringify({ items: newItems }, null, 2),
      {
        encoding: "utf-8",
        flag: "w", // Create or replace
      },
    );
    console.log("Results saved!");
    gs.setActiveScene(GameStateScene.EXIT);
  }
}
