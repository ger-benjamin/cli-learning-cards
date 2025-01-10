import { Scene } from "./scene.js";
import { drawCard } from "./draw-card.js";
import { getCardWidth } from "./card-utils.js";
import { GameStateScene } from "../enums.js";

/**
 * A nice splash screen to welcome the user.
 */
export class SplashScreenScene extends Scene {
  constructor(nextScene: GameStateScene) {
    super();
    process.stdin.once("keypress", (/*letter, key*/) => {
      this.exit(nextScene);
    });
    const card = drawCard(
      ["Cli-learning-cards", "--Press enter--"],
      getCardWidth(this.tWidth),
    );
    this.content.set("all", card);
  }
}
