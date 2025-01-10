type SelectedChangeCb = (selectedChoices: string[]) => void;
type CursorMoveCb = (currentChoice: string) => void;
/* eslint-disable  @typescript-eslint/no-explicit-any */
type KeyPressCb = (letter: string, key: any) => void;

/**
 * Allows to select items in a list by listening user inputs (keypress).
 * Nothing will be displayed from here.
 * Is linked directly to stdin and can't work with other instance of itself.
 */
class ListSelect {
  private selectedChoices: string[] = [];
  private choices: string[] = [];
  private cursor = 0;
  private onKeypressCb: KeyPressCb | null = null;

  constructor() {}

  /**
   * Start to listen the user input and call the related callback.
   * Un-listen previously registered listen fn.
   */
  listen(
    choices: string[],
    selectedChangeCb: SelectedChangeCb,
    cursorMoveCb: CursorMoveCb,
  ) {
    this.unListen();
    this.selectedChoices = [];
    this.choices = choices;
    this.cursor = 0;
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    this.onKeypressCb = (_letter: string, key: any): void => {
      if (
        key.name === "return" ||
        key.name === "enter" ||
        key.name === "space"
      ) {
        this.onSelect(selectedChangeCb);
        return;
      }
      if (key.name === "up" || key.name === "down") {
        this.onUpDown(key.name === "up", cursorMoveCb);
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

  /**
   * On select, call the selectedChangeCb with the current selection.
   * @private
   */
  private onSelect(selectedChangeCb: SelectedChangeCb) {
    const selectedChoice = this.choices[this.cursor];
    if (selectedChoice) {
      this.toggleSelectedChoices(selectedChoice);
      selectedChangeCb(this.selectedChoices);
    }
  }

  /**
   * Select the given choice if it's not already selected. Deselect it otherwise.
   * @private
   */
  private toggleSelectedChoices(selectedChoice: string) {
    if (this.selectedChoices.includes(selectedChoice)) {
      this.selectedChoices = this.selectedChoices.filter(
        (choice) => choice !== selectedChoice,
      );
    } else {
      this.selectedChoices.push(selectedChoice);
    }
  }

  /**
   * On up or down, call the cursorMoveCb with the current choice.
   * @private
   */
  private onUpDown(isUp: boolean, cursorMoveCb: CursorMoveCb) {
    this.updateCursor(isUp);
    const selectedChoice = this.choices[this.cursor];
    if (selectedChoice) {
      cursorMoveCb(selectedChoice);
    }
  }

  /**
   * Update the cursor position on the list of choices (with loop effect).
   * @private
   */
  private updateCursor(up: boolean) {
    if (up) {
      this.cursor =
        this.cursor === 0 ? this.choices.length - 1 : this.cursor - 1;
    } else {
      this.cursor =
        this.cursor === this.choices.length - 1 ? 0 : this.cursor + 1;
    }
  }
}

/**
 * Allows to select items in a list by listening user inputs (keypress).
 * Nothing will be displayed from here.
 */
const listSelect = new ListSelect();
export default listSelect;
