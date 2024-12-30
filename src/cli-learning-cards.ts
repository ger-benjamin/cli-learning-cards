import readline from "node:readline";
import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";
import gs, { GameStateScene } from "./game-state.js";
import {
  Scene,
  SplashScreenScene,
  SettingsScene,
  CardScene,
  ResultsScene,
} from "./scenes/index.js";
import {
  EnterAnyKeyIE,
  SettingsIE,
  CardIE,
  ResultsIE,
} from "./input-entries/index.js";
import type { InputEntry } from "./input-entries/index.js";

/**
 * Cli Learning cards main process.
 * Read source, ask number of element to revise, prompt
 * card and handle answers.
 */
export class CliLearningCards {
  private readonly sourcePath: URL;
  private rl: readline.Interface;
  private scene?: Scene;
  private inputEntry?: InputEntry;

  constructor(sourcePath: URL) {
    this.rl = createInterface({ input: stdin, output: stdout });
    this.sourcePath = sourcePath;
    gs.getActiveScene().on("change", (scene: GameStateScene) => {
      this.setScene(scene);
    });
    gs.setActiveScene(GameStateScene.SPLASH_SCREEN);
  }

  /**
   * Initialize the readline stream.
   */
  startStream() {
    this.rl
      .on("line", (line) => {
        if (this.scene) {
          this.scene.render();
        }
        if (line !== undefined && this.inputEntry) {
          this.inputEntry.readLine(line);
        }
      })
      .on("close", () => {
        process.exit(0);
      });
  }

  /**
   * Stop the readline stream.
   */
  stop() {
    this.rl.close();
  }

  /**
   * Start the read-line stram and the questions processes.
   */
  run() {
    this.startStream();
  }

  private setScene(scene: GameStateScene) {
    if (scene === GameStateScene.SPLASH_SCREEN) {
      this.scene = new SplashScreenScene();
      this.inputEntry = new EnterAnyKeyIE(GameStateScene.SETTINGS);
    } else if (scene === GameStateScene.SETTINGS) {
      this.scene = new SettingsScene();
      this.inputEntry = new SettingsIE(this.sourcePath);
    } else if (scene === GameStateScene.CARD) {
      this.scene = new CardScene();
      this.inputEntry = new CardIE();
    } else if (scene === GameStateScene.RESULTS) {
      if (gs.getAnswers().length) {
        this.scene = new ResultsScene();
        this.inputEntry = new ResultsIE(this.sourcePath);
      } else {
        gs.setActiveScene(GameStateScene.EXIT);
      }
    } else {
      this.stop();
      return;
    }
    if (this.scene) {
      this.scene.render();
    }
  }
}
