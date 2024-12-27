/**
 * @returns A hint based on a text.
 */
export const getHint = (text: string): string => {
  const hint: string[] = [];
  const words = text.split(" ");
  words.forEach((word) => {
    const letters = word.split("").sort();
    hint.push(...letters);
    hint.push(" ");
  });
  hint.pop();
  return `${hint.join("")}`;
};
