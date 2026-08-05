import { GAP_SYM, NEW_LINE_SYM } from "./constants";
import { charListToString, composeInjectors, withLimiters, withWords } from "./injectors";
import { CharList, Height, IConfig } from "./types";
import { getWordsDisplayWidth } from "./width";

const buildBlankCharList = (lineLen: number, filler: string): CharList =>
  Array.from({ length: lineLen }, () => filler);

export const buildSolidLine = (config: IConfig, leftIndent: string): string => {
  const injectLimiters = withLimiters(config.limiters.left, config.limiters.right);

  const blankCharList = buildBlankCharList(config.lineLen, config.sym);
  const computedCharList = composeInjectors(injectLimiters)(blankCharList);

  return leftIndent + charListToString(computedCharList);
};

const buildSingleWordsLine = (
  config: IConfig,
  transformedWords: string,
  leftIndent: string,
): string => {
  const injectLimiters = withLimiters(config.limiters.left, config.limiters.right);
  const injectWords = withWords(config.align, transformedWords);

  // Shrink the blank line by the overflow so the rendered line is exactly
  // `lineLen` cells and aligns with solid lines. Overflow is caused by CJK chars
  // which take `config.cjkWidthRatio` cells per character but only 1 slot.
  const wordWidth = getWordsDisplayWidth(transformedWords, config.cjkWidthRatio);
  const effectiveLen = config.lineLen - Math.floor(wordWidth - transformedWords.length);
  const blankCharList = buildBlankCharList(effectiveLen, config.sym);
  const computedCharList = composeInjectors(injectLimiters, injectWords)(blankCharList);

  return leftIndent + charListToString(computedCharList);
};

export const buildWordsLine = (
  config: IConfig,
  transformedWords: string,
  leftIndent: string,
): string => {
  // Multi-line text is rendered as one divider line per text line.
  return transformedWords
    .split(NEW_LINE_SYM)
    .map((line) => buildSingleWordsLine(config, line, leftIndent))
    .join(NEW_LINE_SYM);
};

export const buildBlock = (
  config: IConfig,
  transformedWords: string,
  leftIndent: string,
): string => {
  const textConfig: IConfig = { ...config, sym: GAP_SYM };
  const topLine = buildSolidLine(config, leftIndent);
  const textLine = buildWordsLine(textConfig, transformedWords, leftIndent);
  const bottomLine = buildSolidLine(config, leftIndent);

  return topLine + NEW_LINE_SYM + textLine + NEW_LINE_SYM + bottomLine;
};

type Builder = (config: IConfig, transformedWords: string, leftIndent: string) => string;

export const BUILDERS_MAP: Record<Height, Builder> = {
  block: buildBlock,
  line: buildWordsLine,
};
