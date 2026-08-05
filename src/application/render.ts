import { BUILDERS_MAP, buildSolidLine } from "../core/build";
import { checkCommentChars, checkFillerLen, checkLongText } from "../core/errors";
import { TRANSFORM_MAP } from "../core/transform";
import { IConfig, PresetId } from "../core/types";

const extractIndent = (rawText: string): string => rawText.split(/\S+/)[0];

const renderHeader = (croppedText: string, config: IConfig, indent: string): string => {
  checkCommentChars(croppedText, config.limiters);
  checkLongText(croppedText, config.lineLen, config.limiters, config.cjkWidthRatio);
  checkFillerLen(config.sym);

  const transformedWords = TRANSFORM_MAP[config.transform](croppedText);
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
