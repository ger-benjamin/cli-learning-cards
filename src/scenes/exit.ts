import { Scene } from "./scene.js";
import gs, { GameStateScene } from "../game-state.js";
import { drawCard } from "./draw-card.js";
import { getCardWidth } from "./card-utils.js";

/**
 * A nice exit screen to the user.
 */
export class ExitScene extends Scene {
  constructor() {
    super();
    const card = drawCard(["Bye o/"], getCardWidth(this.tWidth));
    this.content.set("all", card);
  }

  override start() {
    super.start();
    const error = gs.getError().getValue();
    if (error) {
      console.error(error);
    }
    this.exit(GameStateScene.NO_SCENE);
  }
}
