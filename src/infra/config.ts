import { workspace } from "vscode";

import { getLanguageLimiters } from "../core/limiters";
import {
  Align,
  Height,
  IConfig,
  ILanguagesMapConfig,
  IPreset,
  PresetId,
  Transform,
} from "../core/types";
import { EXT_ID } from "./constants";

// Maps each preset to its configuration keys. The `line` preset has no
// height/align/transform entries in package.json, so those fall back to defaults.
const PRESET_KEYS: Record<
  PresetId,
  { filler: string; height: string; align: string; transform: string }
> = {
  mainHeader: {
    filler: "mainHeaderFiller",
    height: "mainHeaderHeight",
    align: "mainHeaderAlign",
    transform: "mainHeaderTransform",
  },
  subheader: {
    filler: "subheaderFiller",
    height: "subheaderHeight",
    align: "subheaderAlign",
    transform: "subheaderTransform",
  },
  line: {
    filler: "lineFiller",
    height: "lineHeight",
    align: "lineAlign",
    transform: "lineTransform",
  },
};

const getPreset = (type: PresetId): IPreset => {
  const section = workspace.getConfiguration(EXT_ID);
  const keys = PRESET_KEYS[type];

  // Right-hand side defaults mirror the `contributes.configuration` defaults in
  // package.json, mainly to satisfy strict typing (VSCode settings are optional).
  const lineLen = section.get<number>("length", 80);
  const sym = section.get<string>(keys.filler, "-");
  const height = section.get<Height>(keys.height, "line");
  const align = section.get<Align>(keys.align, "center");
  const transform = section.get<Transform>(keys.transform, "none");
  const includeIndent = section.get<boolean>("shouldLengthIncludeIndent", false);
  const cjkWidthRatio = section.get<number>("cjkWidthRatio", 2);

  return { lineLen, sym, height, align, transform, includeIndent, cjkWidthRatio };
};

const getLanguagesMapConfig = (): ILanguagesMapConfig | undefined =>
  workspace.getConfiguration(EXT_ID).inspect<ILanguagesMapConfig>("languagesMap")?.globalValue;

export const getConfig = (presetId: PresetId, lang: string): IConfig => ({
  ...getPreset(presetId),
  limiters: getLanguageLimiters(lang, getLanguagesMapConfig),
});
