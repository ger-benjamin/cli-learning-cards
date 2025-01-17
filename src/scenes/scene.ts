import readline from "node:readline";
import { stdout, stdin } from "node:process";
import gs from "../game-state.js";
import { GameStateScene } from "../enums.js";

/**
 * Abstract scene - or UI - to handle user input and render texts.
 */
export abstract class Scene {
  protected rl?: readline.Interface;
  protected onKeypress?: (letter: string, key: unknown) => void;
  protected readonly content: Map<string, string> = new Map<string, string>();
  protected tWidth: number;
  protected canWrite = true;
  protected terminated = false;

  protected constructor() {
    this.tWidth = stdout.columns;
  }

  /**
   * On scene starts, clear the terminal and render the (new) content.
   */
  start() {
    this.rl = readline.createInterface({
      input: stdin,
      output: stdout,
    });
    this.listenToKeypress();
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
    if (!this.rl || !this.canWrite) {
      return;
    }
    const caret = "\x1b[32m_\x1b[0m";
    const chars = this.rl.line.split("");
    chars.splice(this.rl.cursor, 0, caret);
    console.log(chars.join(""));
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
    this.terminated = true;
    this.stopListeningToKeypress();
    if (this.rl) {
      this.rl.close();
    }
    gs.setActiveScene(nextScene);
  }

  protected listenToKeypress() {
    if (!this.onKeypress) {
      this.setupKeyPress();
    }
    stdin.on("keypress", this.onKeypress!);
  }

  protected stopListeningToKeypress() {
    if (this.onKeypress) {
      stdin.off("keypress", this.onKeypress);
    }
  }

  protected setupKeyPress() {
    this.onKeypress = (letter, key: any) => {
      if (this.terminated) {
        return;
      }
      if (!letter && key.name !== "left" && key.name !== "right") {
        return;
      }
      readline.cursorTo(stdout, 0, 0);
      readline.clearLine(stdout, 0);
      this.clear();
      this.render();
    };
  }
}
