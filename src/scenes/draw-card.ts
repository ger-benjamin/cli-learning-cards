/**
 * Like String.split, but preserve the split symbol except for the last one.
 * Example: splitKeep('Machine-learning', '-') will return ['machine-', 'learning']
 * @returns the splitted part of the text.
 */
export const splitKeep = (text: string, splitBy: string): string[] => {
  // Returns the text as is if it doesn't contain the split symbol.
  if (!text.includes(splitBy)) {
    return [text];
  }
  const parts = text.split(splitBy).map((part) => `${part}${splitBy}`);
  // Don't drop the last charactere on empty splitBy.
  if (splitBy === "") {
    return parts;
  }
  // Remove the last part's splitBy charactere added by this function.
  let last = parts.pop();
  if (last) {
    last = last.slice(0, last.length - 1);
    parts.push(last);
  }
  return parts;
};

/**
 * Split a text (by space, carret...) into strings not longer than a given
 * value.
 * Param "level" must not be set manually.
 * @returns an array of length limited strings.
 */
export const splitText = (
  text: string,
  maxLetters: number,
  level = 0,
): string[] => {
  // The text is short enough ? Then returns it.
  if (text.length <= maxLetters) {
    return [text];
  }
  // Choose how to split by levels.
  let splitBy = " ";
  if (level > 0) {
    splitBy = level === 1 ? "-" : "";
  }
  const parts = splitKeep(text, splitBy)
    .map((part) => splitText(part, maxLetters, level + 1))
    .flat();
  return parts;
};

/**
 * Split a text into lines with a limited amount of characteres.
 * @returns an array of length limited lines.
 */
export const getLimitedSizeLines = (
  text: string,
  maxLetters: number,
): string[] => {
  const parts = splitText(text, maxLetters);
  let line = "";
  const lines: string[] = [];
  parts.forEach((part, index) => {
    if (line.length + part.length >= maxLetters) {
      lines.push(line);
      line = "";
    }
    line = `${line}${part}`;
    if (index >= parts.length - 1) {
      lines.push(line);
    }
  });
  return lines;
};

/**
 * @returns A nicely formatted "card" drawing with centered text in it.
 */
export const drawCard = (texts: string[], maxLetters: number): string => {
  const minBorder = 3;
  const topBottom = Array(maxLetters).fill("-").join("");
  const emptyLine = `|${Array(maxLetters - 2)
    .fill(" ")
    .join("")}|`;
  const textLines = texts
    .map((text) => {
      // Line break would destroy the layout. Remove them !
      const inlineText = text.replaceAll("\n", "");
      // Break text into limited size line to fill correctly the layout.
      const limitedLines = getLimitedSizeLines(
        inlineText,
        maxLetters - minBorder,
      ).map((line) => {
        // Center the line.
        const padding = Math.max(0, maxLetters - line.length - 2) / 2;
        const leftPadding = Math.floor(padding);
        const rightPadding = Math.ceil(padding);
        const lp = Array(leftPadding).fill(" ").join("");
        const rp = Array(rightPadding).fill(" ").join("");
        return `|${lp}${line}${rp}|`;
      });
      // Returns the lines and an empty space to separate each text.
      return [...limitedLines, emptyLine];
    })
    .flat();
  // Remove the last (useless) "emptyLine" separation.
  textLines.pop();
  return `
${topBottom}
${emptyLine}
${emptyLine}
${textLines.join("\n")}
${emptyLine}
${emptyLine}
${topBottom}`;
};
