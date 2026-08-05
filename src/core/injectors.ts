import { getWordsAnchors } from "./anchors";
import { GAP_SYM } from "./constants";
import { Align, CharList } from "./types";

export type CharListInjector = (charList: CharList) => CharList;

export const charListToString = (charList: CharList): string => charList.join("");

export const withLimiters = (leftLim: string, rightLim: string): CharListInjector => {
  return (charList: CharList): CharList => {
    const rightLimAnchor = charList.length - rightLim.length;

    return charList.map((char, i) => {
      // Insert left limiter
      if (i < leftLim.length) return leftLim[i];
      // Insert right limiter
      else if (i >= rightLimAnchor) return rightLim[i - rightLimAnchor];
      // Insert gaps after/before non-empty limiters
      else if (
        (leftLim.length && i === leftLim.length) ||
        (rightLim.length && i === rightLimAnchor - 1)
      )
        return GAP_SYM;
      // Pass other chars
      else return char;
    });
  };
};

export const withWords = (align: Align, words: string): CharListInjector => {
  return (charList: CharList): CharList => {
    const { leftAnchor, rightAnchor } = getWordsAnchors(align, words, charList);

    return charList.map((char, i) => {
      // Insert words
      if (i >= leftAnchor && i <= rightAnchor) return words[i - leftAnchor];
      // Insert gaps before/after words
      else if (i === leftAnchor - 1 || i === rightAnchor + 1) return GAP_SYM;
      // Pass other chars
      else return char;
    });
  };
};

export const composeInjectors =
  (...injectors: CharListInjector[]): CharListInjector =>
  (charList: CharList): CharList =>
    injectors.reduce((res: CharList, injector) => injector(res), charList);
