type onEnterCb = (string: string) => void;
type OnCursorMoveCb = (position: number) => void;
type OnTextChangedCb = (newText: string) => void;
/* eslint-disable  @typescript-eslint/no-explicit-any */
type KeyPressCb = (letter: string, key: any) => void;

/**
 * Todo
 */
class InputText {
  private characters: string[] = [];
  private cursor = 0;
  private onKeypressCb: KeyPressCb | null = null;

  constructor() {}

  /**
   * Start to listen the user input and call the related callback.
   * Un-listen previously registered listen fn.
   */
  listen(
    onEnterCb: onEnterCb,
    onCursorMoveCb: OnCursorMoveCb,
    onTextChanged: OnTextChangedCb,
  ) {
    this.unListen();
    this.cursor = 0;
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    this.onKeypressCb = (letter: string, key: any): void => {
      if (letter) {
        this.characters.push(letter);
        onTextChanged(this.characters.join(""));
        return;
      }
      if (key.name === "space") {
        this.characters.push(" ");
        onTextChanged(this.characters.join(""));
        return;
      }
      if (key.name === "backspace") {
        this.characters.splice(this.cursor - 1, 1);
        onTextChanged(this.characters.join(""));
        return;
      }
      if (key.name === "left" || key.name === "right") {
        this.moveCursor(key.name === "left");
        onCursorMoveCb(this.cursor);
        return;
      }
      if (key.name === "return" || key.name === "enter") {
        onEnterCb(this.characters.join(""));
        return;
      }
    };
    process.stdin.on("keypress", this.onKeypressCb);
  }

  /**
   * Remove current keypress listening.
   */
  unListen() {
    if (this.onKeypressCb) {
      process.stdin.removeListener("keypress", this.onKeypressCb);
    }
  }

  private moveCursor(isLeft: boolean) {
    this.cursor = isLeft ? this.cursor - 1 : this.cursor + 1;
    if (this.cursor < 0) {
      this.cursor = 0;
    } else if (this.cursor > this.characters.length) {
      this.cursor = this.characters.length;
    }
  }
}

/**
 * TODO
 */
const inputText = new InputText();
export default inputText;
