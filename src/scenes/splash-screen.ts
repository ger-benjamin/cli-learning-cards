import { Scene } from "./scene.js";
import { drawCard } from "./draw-card.js";
import { getCardWidth } from "./card-utils.js";
import { GameStateScene } from "../enums.js";

/**
 * A nice splash screen to welcome the user.
 */
export class SplashScreenScene extends Scene {
  private readonly nextScene: GameStateScene;

  constructor(nextScene: GameStateScene) {
    super();
    this.nextScene = nextScene;
    this.canWrite = false;
  }

  override start() {
    process.stdin.once("keypress", (_letter, key) => {
      if (key.name === "return" || key.name === "enter") {
        this.exit(this.nextScene);
      }
    });
    const card = drawCard(
      ["Cli-learning-cards", "--Press enter--"],
      getCardWidth(this.tWidth),
    );
    this.setContent("all", card, true);
    super.start();
  }
}
