import type { InputEntry } from "./input-entry.js";
import gs, { GameStateScene } from "../game-state.js";

export class EnterAnyKeyIE implements InputEntry {
  constructor(nextScene: GameStateScene) {
    // process.stdin.on('keypress', (letter, key) => {
    process.stdin.once("keypress", () => {
      gs.setActiveScene(nextScene);
    });
  }

  //readLine(_answer: string): void {}
  readLine(): void {}
}
