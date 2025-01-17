import readline from "node:readline";
import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";
import gs from "./game-state.js";
import {
  Scene,
  SplashScreenScene,
  SettingsScene,
  CardScene,
  ResultsScene,
  ExitScene,
} from "./scenes/index.js";
import { GameStateScene } from "./enums.js";

/**
 * Cli Learning cards main process.
 * Read source, ask number of element to revise, prompt
 * card and handle answers.
 */
export class CliLearningCards {
  private rl: readline.Interface;
  private scene?: Scene;

  constructor(sourcePath: URL) {
    this.rl = createInterface({ input: stdin, output: stdout });
    gs.setSourcePath(sourcePath);
    gs.getActiveScene().on("change", (scene: GameStateScene) => {
      this.setScene(scene);
    });
    gs.setActiveScene(GameStateScene.SPLASH_SCREEN);
    this.setPrompt();
  }

  /**
   * Initialize the readline stream.
   */
  startStream() {
    this.rl
      .on("line", (line) => {
        if (!gs.getPauseStream()) {
          this.scene?.readLine(line);
        }
      })
      .on("close", () => {
        process.stdout.write("\x1B[?25h"); // Show again the cursor !
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
   * Start the read-line stream and the questions processes.
   */
  run() {
    this.startStream();
  }

  private setPrompt() {
    this.rl.setPrompt("");
    this.rl.prompt();
    process.stdout.write("\x1B[?25l"); // Hide the cursor.
  }

  /**
   * Activate another scene based on the GameStateScene.
   * Auto call "start" on scene change.
   * @private
   */
  private setScene(scene: GameStateScene) {
    if (scene === GameStateScene.SPLASH_SCREEN) {
      this.scene = new SplashScreenScene(GameStateScene.SETTINGS);
    } else if (scene === GameStateScene.SETTINGS) {
      this.scene = new SettingsScene();
    } else if (scene === GameStateScene.CARD) {
      this.scene = new CardScene();
    } else if (scene === GameStateScene.RESULTS) {
      if (gs.getAnswers().length) {
        this.scene = new ResultsScene();
      } else {
        gs.setActiveScene(GameStateScene.EXIT);
      }
    } else if (scene === GameStateScene.EXIT) {
      this.scene = new ExitScene();
    } else {
      this.stop();
      return;
    }
    if (this.scene) {
      this.scene.start();
    }
  }
}
