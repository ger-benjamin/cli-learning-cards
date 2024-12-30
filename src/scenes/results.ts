import { Scene } from "./scene.js";
import { printResults } from "../results.js";
import gs from "../game-state.js";

export class ResultsScene extends Scene {
  constructor() {
    super();
  }

  override render() {
    printResults(gs.getSelectedItems());
    console.log("Do you want to save the results?");
  }
}
