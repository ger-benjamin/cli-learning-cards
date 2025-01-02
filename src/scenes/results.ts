import { writeFileSync } from "node:fs";
import { Scene } from "./scene.js";
import { printResults } from "../results.js";
import gs, { GameStateScene } from "../game-state.js";

export class ResultsScene extends Scene {
  constructor() {
    super();
  }

  override start() {
    this.clean();
    printResults(gs.getSelectedItems());
    console.log("Do you want to save the results?");
  }

  override readLine(answer: string) {
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
      gs.getSourcePath(),
      JSON.stringify({ items: newItems }, null, 2),
      {
        encoding: "utf-8",
        flag: "w", // Create or replace
      },
    );
    console.log("Results saved!");
    this.exit(GameStateScene.EXIT);
  }
}
