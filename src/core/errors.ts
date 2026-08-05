import { ILimiters } from "./types";
import { getWordsDisplayWidth } from "./width";

export type ErrorCode = "EMPTY_LINE" | "MULTI_LINE" | "LONG_TEXT" | "COMMENT_CHARS" | "FILLER_LEN";

export class DividerError extends Error {
  readonly code: ErrorCode;

  constructor(code: ErrorCode) {
    super(code);
    this.name = "DividerError";
    this.code = code;
  }
}

export const checkCommentChars = (text: string, limiters: ILimiters): void => {
  if (
    (limiters.left && text.includes(limiters.left)) ||
    (limiters.right && text.includes(limiters.right))
  )
    throw new DividerError("COMMENT_CHARS");
};

export const checkLongText = (
  text: string,
  lineLen: number,
  limiters: ILimiters,
  cjkWidthRatio = 2,
): void => {
  const limitersLen = limiters.left.length + limiters.right.length;
  const gapsCount = 4;
  const minFillerCount = 2;
  const maxAllowedLen = lineLen - (limitersLen + gapsCount + minFillerCount);
  // Validate by display width so full-width/CJK text is measured correctly
  // (each CJK char takes `cjkWidthRatio` cells) and can't overflow the line.
  if (getWordsDisplayWidth(text, cjkWidthRatio) > maxAllowedLen)
    throw new DividerError("LONG_TEXT");
};

export const checkFillerLen = (fillerSym: string): void => {
  if (fillerSym.length !== 1) throw new DividerError("FILLER_LEN");
};
