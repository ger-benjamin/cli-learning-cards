import { Scene } from "./scene.js";
import { GameStateScene } from "../game-state.js";
import { drawCard } from "./draw-card.js";

export class SplashScreenScene extends Scene {
  constructor(nextScene: GameStateScene) {
    super();
    process.stdin.once("keypress", (/*letter, key*/) => {
      this.exit(nextScene);
    });
    const card = drawCard(
      ["Cli-learning-cards", "--Press enter--"],
      this.getCardWidth(),
    );
    this.content.set("all", card);
  }
}
