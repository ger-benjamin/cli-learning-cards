import readline from "node:readline";
import { stdout } from "node:process";
import gs from "../game-state.js";
import { GameStateScene } from "../enums.js";

/**
 * Abstract scene - or UI - to handle user input and render texts.
 */
export abstract class Scene {
  protected readonly content: Map<string, string> = new Map<string, string>();
  protected tWidth: number;

  protected constructor() {
    this.tWidth = process.stdout.columns;
  }

  /**
   * On scene starts, clear the terminal and render the (new) content.
   */
  start() {
    this.clear();
    this.render();
  }

  /**
   * Clears the terminal.
   */
  clear() {
    readline.cursorTo(stdout, 0, 0);
    readline.clearScreenDown(stdout);
  }

  /**
   * Loops on the content to render it.
   */
  render() {
    this.content.forEach((entry) => {
      if (entry) {
        console.log(entry);
      }
    });
  }

  /**
   * Set the content to render, clear and render again.
   * @param line The line (key) of the content to set.
   * @param text The text to set.
   * @param silent If true, updates the text but don't clear and don't render again.
   */
  setContent(line: string, text: string, silent = false) {
    this.content.set(line, text);
    if (silent) {
      return;
    }
    this.clear();
    this.render();
  }

  /**
   * Abstract method to react on user line inputs.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  readLine(answer: string) {}

  /**
   * On scene exit, activate another scene.
   */
  exit(nextScene: GameStateScene) {
    gs.setActiveScene(nextScene);
  }
}
