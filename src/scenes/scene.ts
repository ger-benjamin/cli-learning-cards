import readline from "node:readline";
import { stdout } from "node:process";

export abstract class Scene {
  protected readonly content: Map<string, string> = new Map<string, string>();
  protected readonly msg: Map<string, string> = new Map<string, string>();

  constructor() {}

  clean() {
    readline.cursorTo(stdout, 0, 0);
    readline.clearScreenDown(stdout);
  }

  render() {
    this.content.forEach((entry) => console.log(entry));
    this.msg.forEach((entry) => {
      if (entry) {
        console.log(entry);
      }
    });
  }
}
