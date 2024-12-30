import { Scene } from "./scene.js";

export class SettingsScene extends Scene {
  constructor() {
    super();
  }

  override render() {
    this.clean();
    super.render();
  }
}
