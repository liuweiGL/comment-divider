import { BUILDERS_MAP, buildSolidLine } from "../core/build";
import { NEW_LINE_SYM } from "../core/constants";
import { checkCommentChars, checkFillerLen, checkLongText } from "../core/errors";
import { TRANSFORM_MAP } from "../core/transform";
import { IConfig, PresetId } from "../core/types";

const extractIndent = (rawText: string): string => {
  const firstContentLine = rawText.split(NEW_LINE_SYM).find((line) => line.trim()) ?? rawText;
  return firstContentLine.split(/\S+/)[0];
};

const renderHeader = (croppedText: string, config: IConfig, indent: string): string => {
  // Split into trimmed, non-empty text lines so a multi-line selection becomes
  // multiple divider text lines (each centered independently).
  const lines = croppedText
    .split(NEW_LINE_SYM)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    checkCommentChars(line, config.limiters);
    checkLongText(line, config.lineLen, config.limiters, config.cjkWidthRatio);
  }
  checkFillerLen(config.sym);

  const transformedWords = lines
    .map((line) => TRANSFORM_MAP[config.transform](line))
    .join(NEW_LINE_SYM);

  return BUILDERS_MAP[config.height](config, transformedWords, indent);
};

const renderLine = (config: IConfig, indent: string): string => {
  checkLongText("", config.lineLen, config.limiters);
  checkFillerLen(config.sym);

  return buildSolidLine(config, indent);
};

export const render = (type: PresetId, rawText: string, config: IConfig): string => {
  const indent = extractIndent(rawText);
  // Derive a new config instead of mutating the caller's object.
  const adjustedConfig: IConfig = config.includeIndent
    ? { ...config, lineLen: config.lineLen - indent.length }
    : config;

  const croppedText = rawText.trim();

  switch (type) {
    case "line":
      return renderLine(adjustedConfig, indent);
    case "mainHeader":
    case "subheader":
      return renderHeader(croppedText, adjustedConfig, indent);
  }
};
