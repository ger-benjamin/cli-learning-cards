export const enum GameStateScene {
  SPLASH_SCREEN = "splash-screen",
  SETTINGS = "settings",
  CARD = "card",
  RESULTS = "results",
  EXIT = "exit",
  NO_SCENE = "no_scene",
}

/** Possible Correction strategies. */
export enum CorrectionStrategies {
  Simple = "Simple",
}

/** Possible get hint strategies. */
export enum HintStrategies {
  SortLetters = "Sort letters",
  SomeWords = "Some words",
}

/** Possible Selection strategies. */
export enum SelectionStrategies {
  RevisionDate = "Revision date",
  Random = "Random",
}

/** The available game mode, or game predefined settings. **/
export enum GameMode {
  TEN_CARDS = "Ten cards",
  FREE = "Free",
  TIMED = "Timed",
  LIVES = "Lives",
  RANDOM = "Random",
}

/** Valid positive answers to yes or no questions. */
export const validPositiveAnswers = ["yes", "y", "1", "true", "t"];
/** Valid negative answers to yes or no questions. */
export const validNegativeAnswers = ["no", "n", "0", "false", "f"];
