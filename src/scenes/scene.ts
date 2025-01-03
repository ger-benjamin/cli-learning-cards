import readline from "node:readline";
import { stdout } from "node:process";
import gs, { GameStateScene } from "../game-state.js";

export abstract class Scene {
  protected readonly content: Map<string, string> = new Map<string, string>();
  protected tHeight: number;
  protected tWidth: number;

  constructor() {
    this.tHeight = process.stdout.rows;
    this.tWidth = process.stdout.columns;
  }

  start() {
    this.clean();
    this.render();
  }

  clean() {
    readline.cursorTo(stdout, 0, 0);
    readline.clearScreenDown(stdout);
  }

  render() {
    this.content.forEach((entry) => {
      if (entry) {
        console.log(entry);
      }
    });
  }

  getCardWidth(): number {
    return Math.min(this.tWidth, 50);
  }

  setContent(line: string, text: string, silent = false) {
    this.content.set(line, text);
    if (silent) {
      return;
    }
    this.clean();
    this.render();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  readLine(answer: string) {}

  exit(nextScene: GameStateScene) {
    gs.setActiveScene(nextScene);
  }
}
