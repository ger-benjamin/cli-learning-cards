/**
 * Answer given by a player.
 * The "id" could be not unique.
 */
export interface Answer {
  id: string;
  userAnswer: string;
  displayedQuestion: string;
}
