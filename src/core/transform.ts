import { GAP_SYM } from "./constants";
import { Transform } from "./types";

const pass = (words: string): string => words;

const toLowerCase = (words: string): string => words.toLowerCase();

const toUpperCase = (words: string): string => words.toUpperCase();

const toTitleCase = (words: string): string =>
  words
    .split(GAP_SYM)
    .map((word) =>
      Array.from(word)
        .map((char, idx) => (idx === 0 ? char.toUpperCase() : char))
        .join(""),
    )
    .join(GAP_SYM);

export const TRANSFORM_MAP: Record<Transform, (words: string) => string> = {
  lowercase: toLowerCase,
  uppercase: toUpperCase,
  titlecase: toTitleCase,
  none: pass,
};
