import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

/**
 * Messenger (prompter) with only static-like
 * classes.
 */
export class LightMessenger {
  constructor() {}

  /**
   * Prompt a standard message.
   */
  log(text: string) {
    console.log(text);
  }

  /**
   * Prompt an error message.
   */
  error(text: string) {
    console.error(text);
  }

  /**
   * Prompt a debug message.
   */
  debug(text: string) {
    console.debug(`Debug: ${text}`);
  }

  /**
   * Prompt line separation characters.
   */
  showSeparation() {
    console.log("=========================");
  }
}

/**
 * Ready to use light-messenger (prompter).
 */
export const lightMessenger = new LightMessenger();

/**
 * Full Messenger with readline interface.
 */
export class Messenger extends LightMessenger {
  private rl?: readline.Interface;

  constructor() {
    super();
  }

  /**
   * Initialize the readline stream.
   */
  init() {
    this.rl = readline.createInterface({ input: stdin, output: stdout });
  }

  /**
   * Stop the readline stream.
   */
  stop() {
    this.rl?.close();
  }

  /**
   * Prompt a question and wait on user's input.
   * @param text the question to ask.
   * @returns A promise with the answer.
   */
  async ask(text: string): Promise<string> {
    if (!this.rl) {
      return "";
    }
    return await this.rl.question(`${text}\n`);
  }
}
