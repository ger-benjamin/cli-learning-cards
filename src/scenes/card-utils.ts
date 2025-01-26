/**
 * @returns the ideal width of cards.
 */
export const getCardWidth = (terminalWidth: number): number => {
  return Math.max(Math.min(terminalWidth, 50) || 0, 25);
};
