import { Scene } from "./scene.js";
import { drawCard } from "./draw-card.js";
import { getCardWidth } from "./card-utils.js";
import { GameStateScene } from "../enums.js";

/**
 * A nice splash screen to welcome the user.
 */
export class SplashScreenScene extends Scene {
  private readonly nextScene: GameStateScene;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  private readonly onKeyPress: (letter: string, key: any) => void;

  constructor(nextScene: GameStateScene) {
    super();
    this.nextScene = nextScene;
    this.canWrite = false;
    this.onKeyPress = (_letter, key) => {
      if (key.name === "return" || key.name === "enter") {
        this.exit(this.nextScene);
      }
    };
  }

  /**
   * Shows the splash-screen and listen to "enter" key press to
   * continue to the next scene.
   */
  override start() {
    process.stdin.on("keypress", this.onKeyPress);
    const card = drawCard(
      ["Cli-learning-cards", "--Press enter--"],
      getCardWidth(this.tWidth),
    );
    this.setContent("all", card, true);
    super.start();
  }

  /**
   * Exits this scene and remove the keypress listener.
   */
  override exit(nextScene: GameStateScene) {
    process.stdin.off("keypress", this.onKeyPress);
    super.exit(nextScene);
  }
}
