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
