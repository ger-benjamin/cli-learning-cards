import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { readFile } from "node:fs/promises";
import type {SourceJson} from "./source-json.js";

export class CliLearningCards {
  private rl?: readline.Interface;
  private cardsLimit = 0;
  private readonly sourcePath: URL;
  private sourceJson?: SourceJson;

  constructor(sourcePath: URL) {
    this.sourcePath = sourcePath;
  }

  async run() {
    this.rl = readline.createInterface({ input: stdin, output: stdout });
    await this.readJsonSource();
    if (!this.sourceJson || !this.sourceJson.items) {
      console.error("Can not use source json file.");
      this.stop();
    }
    await this.askNumberCards();
    this.stop();
  }

  stop() {
    this.rl?.close();
  }

  private async readJsonSource() {
    try {
      const contents = await readFile(this.sourcePath, { encoding: "utf8" });
      this.sourceJson = JSON.parse(contents);
    } catch (err) {
      console.error((err as Error).message);
    }
  }

  private async askNumberCards() {
    const max = this.sourceJson?.items?.length ?? -1;
    const answer = parseInt(
      await this.ask(`How many cards do you want to train? (max ${max})\n`),
    );
    if (!answer || answer < 0 || answer > max) {
      console.log(`Please write a valid natural number between 0 and ${max}`);
      await this.askNumberCards();
    } else {
      this.cardsLimit = answer;
      console.log("answer ", this.cardsLimit);
    }
  }

  // Get a random item via a strategy

  // show question

  // read answer or __skip
  //   correct ? Update date  "score" and next
  //   incorrect ? Update error and date and "next"
  //   __skip ? Update date and "next"
  // case > nb of item
  // show result and save y/n
  // Update file on yes
  //
  //
  // Correctness strategy
  //    Simple Az===Az
  //    more complicated ? with https://www.npmjs.com/package/fast-diff

  private async ask(text: string): Promise<string> {
    if (!this.rl) {
      return "";
    }
    return await this.rl.question(text);
  }
}
