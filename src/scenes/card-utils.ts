/**
 * @returns the ideal width of cards.
 */
export const getCardWidth = (terminalWidth: number): number => {
  return Math.min(terminalWidth, 50);
};
