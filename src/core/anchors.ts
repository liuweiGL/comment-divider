import { GAP_SYM } from "./constants";
import { Align, CharList, IWordsAnchors } from "./types";

const isEven = (num: number): boolean => num % 2 === 0;

const getCenterAlignedAnchors = (words: string, charList: CharList): IWordsAnchors => {
  const smartRound = !isEven(words.length) && !isEven(charList.length) ? Math.floor : Math.ceil;
  const halfLen = smartRound(charList.length / 2);
  const halfWord = Math.floor(words.length / 2);
  const leftAnchor = halfLen - halfWord;
  const rightAnchor = leftAnchor + (words.length - 1);

  return { leftAnchor, rightAnchor };
};

const getLeftAlignedAnchors = (words: string, charList: CharList): IWordsAnchors => {
  let leftAnchor = 0;

  for (const idx of Object.keys(charList)) {
    if (charList[Number(idx)] === GAP_SYM) {
      leftAnchor = Number(idx) + 1;
      break;
    }
  }

  const rightAnchor = leftAnchor + (words.length - 1);

  return { leftAnchor, rightAnchor };
};

const getRightAlignedAnchors = (words: string, charList: CharList): IWordsAnchors => {
  let rightAnchor = 0;

  const last = charList.length - 1;

  for (const idx of Object.keys(charList)) {
    if (charList[last - Number(idx)] === GAP_SYM) {
      rightAnchor = last - (Number(idx) + 1);
      break;
    }
  }

  const leftAnchor = rightAnchor - (words.length - 1);

  return { leftAnchor, rightAnchor };
};

export const getWordsAnchors = (align: Align, words: string, charList: CharList): IWordsAnchors => {
  switch (align) {
    case "center":
      return getCenterAlignedAnchors(words, charList);
    case "left":
      return getLeftAlignedAnchors(words, charList);
    case "right":
      return getRightAlignedAnchors(words, charList);
  }
};
