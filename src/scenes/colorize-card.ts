import gs from "../game-state.js";
import { Colors } from "../enums.js";
import chalk from "chalk";

/**
 * Use Chalk to colorize the text with the given (background) color.
 * If no color is provided, take the CardColor in the game-state.
 * BrightParam is to use the "bright" color variation.
 * @returns The colorized text or the text as is.
 */
export const colorize = (
  text: string,
  colorParam?: Colors,
  brightParam?: boolean,
): string => {
  const color = colorParam ?? gs.getCardColor();
  const bright = brightParam ?? gs.getQuestionIsFront() !== false;
  if (color === Colors.Blue) {
    if (bright) {
      return chalk.bgBlueBright.black(text);
    }
    return chalk.bgBlue(text);
  }
  if (color === Colors.Red) {
    if (bright) {
      return chalk.bgRedBright.black(text);
    }
    return chalk.bgRed(text);
  }
  if (color === Colors.Green) {
    if (bright) {
      return chalk.bgGreenBright.black(text);
    }
    return chalk.bgGreen(text);
  }
  if (bright) {
    return chalk.bgWhite.black(text);
  }
  return text;
};
