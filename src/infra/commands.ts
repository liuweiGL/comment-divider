import { window } from "vscode";

import { PresetId } from "../core/types";
import { getEditorContext, insertDivider, showError } from "./editor";

const generateCommand = (type: PresetId) => () => {
  try {
    const editor = window.activeTextEditor;
    if (!editor) return;

    insertDivider(type, getEditorContext(editor));
  } catch (e) {
    showError(e);
  }
};

export const mainHeaderCommand = generateCommand("mainHeader");
export const subHeaderCommand = generateCommand("subheader");
export const solidLineCommand = generateCommand("line");
