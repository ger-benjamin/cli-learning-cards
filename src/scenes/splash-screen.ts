import { Scene } from "./scene.js";
import { drawCard } from "./draw-card.js";
import { getCardWidth } from "./card-utils.js";
import { GameStateScene } from "../enums.js";
import { colorize } from "./colorize-card.js";

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
    // See https://emojipedia.org identification_card + white_heavy_check_mark.
    // node-emoji was not complete...
    const emojis = "\u{1FAAA}\u{2611}";
    const card = drawCard(
      [`Cli-learning-cards${emojis}`, "--Press enter--"],
      getCardWidth(this.tWidth),
    );
    this.setContent("all", colorize(card), true);
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
