// Full-width / CJK characters occupy `ratio` grid cells (default 2), others 1.
const getCharDisplayWidth = (char: string, ratio: number): number => {
  const code = char.codePointAt(0) ?? 0;
  if (
    (code >= 0x1100 && code <= 0x115f) || // Hangul Jamo
    (code >= 0x2e80 && code <= 0xa4cf) || // CJK, Yi
    (code >= 0xac00 && code <= 0xd7a3) || // Hangul Syllables
    (code >= 0xf900 && code <= 0xfaff) || // CJK Compatibility Ideographs
    (code >= 0xfe30 && code <= 0xfe4f) || // CJK Compatibility Forms
    (code >= 0xff00 && code <= 0xff60) || // Fullwidth Forms
    (code >= 0xffe0 && code <= 0xffe6) //    Fullwidth signs
  )
    return ratio;
  return 1;
};

export const getWordsDisplayWidth = (words: string, ratio: number): number =>
  Array.from(words).reduce((width, char) => width + getCharDisplayWidth(char, ratio), 0);
