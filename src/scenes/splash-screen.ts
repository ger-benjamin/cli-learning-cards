import { Scene } from "./scene.js";

export class SplashScreenScene extends Scene {
  constructor() {
    super();
    this.content.set(
      "all",
      `
      ------------------------------------------
      |                                        |
      |                                        |
      |           Cli-learning-cards           |
      |            ---Press enter---           |
      |                                        |
      |                                        |
      -----------------------------------------
      `,
    );
  }

  override render() {
    this.clean();
    super.render();
  }
}
