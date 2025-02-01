import readline from "node:readline";
import { stdin, stdout } from "node:process";
import gs from "../game-state.js";
import { Colors, GameStateScene } from "../enums.js";
import { colorize } from "./colorize-card.js";

/**
 * Abstract scene - or UI - to handle user input and render texts.
 * Clear the auto-output of inputs (line writing) to be more flexible.
 * on the rendering (can write line below, can freely update rendering, etc.).
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
   * Starts to listen to keypress to handle manually inputs.
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
   * Render also the writing line manually to be more flexible.
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
    // If we can write, set the caret at the cursor position.
    const chars = this.rl.line.split("");
    const char = chars[this.rl.cursor] || " ";
    chars.splice(this.rl.cursor, 1, colorize(char, Colors.White, true));
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

  /**
   * Starts listening to keypress to restore and show writen line.
   * Must be called on start.
   * @protected
   */
  protected listenToKeypress() {
    if (!this.onKeypress) {
      this.setupKeyPress();
    }
    stdin.on("keypress", this.onKeypress!);
  }

  /**
   * Stop listing to keypress.
   * ust be called on destroy.
   * @protected
   */
  protected stopListeningToKeypress() {
    if (this.onKeypress) {
      stdin.off("keypress", this.onKeypress);
    }
  }

  /**
   * Setup keypress listener to handle typing and cursor move.
   * @protected
   */
  protected setupKeyPress() {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    this.onKeypress = (letter, key: any) => {
      if (this.terminated) {
        // Workaround to be sure input are not listened once terminated.
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
