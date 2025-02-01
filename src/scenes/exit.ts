import { Scene } from "./scene.js";
import gs from "../game-state.js";
import { drawCard } from "./draw-card.js";
import { getCardWidth } from "./card-utils.js";
import { GameStateScene } from "../enums.js";
import { colorize } from "./colorize-card.js";
import { emojify } from "node-emoji";

/**
 * A nice exit screen to the user.
 */
export class ExitScene extends Scene {
  constructor() {
    super();
    this.canWrite = false;
    const card = drawCard([emojify("Bye :wave:")], getCardWidth(this.tWidth));
    this.content.set("all", colorize(card, undefined, false));
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
