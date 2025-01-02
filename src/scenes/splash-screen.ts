import { Scene } from "./scene.js";
import { GameStateScene } from "../game-state.js";

export class SplashScreenScene extends Scene {
  constructor(nextScene: GameStateScene) {
    super();
    process.stdin.once("keypress", (/*letter, key*/) => {
      this.exit(nextScene);
    });
    this.content.set(
      "all",
      `
      ------------------------------------------
      |                                        |
      |                                        |
      |           Cli-learning-cards           |
      |            ---Press enter---           |
      |                                        |
      |                                        |
      -----------------------------------------
      `,
    );
  }
}
