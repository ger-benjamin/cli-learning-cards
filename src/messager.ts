import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

export class Messager {
  private rl?: readline.Interface;

  constructor() {}

  init() {
    this.rl = readline.createInterface({ input: stdin, output: stdout });
  }

  stop() {
    this.rl?.close();
  }

  log(text: string) {
    console.log(text);
  }

  error(text: string) {
    console.error(text);
  }

  debug(text: string) {
    console.debug(`Debug: ${text}`);
  }

  showSeparation() {
    console.log("=============");
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

export const lightMessager = new Messager();
