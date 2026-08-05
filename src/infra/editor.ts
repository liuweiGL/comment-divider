import { commands, window, type Selection, type TextEditor, type TextLine } from "vscode";

import { render } from "../application/render";
import { DividerError, ErrorCode } from "../core/errors";
import { PresetId } from "../core/types";
import { getConfig } from "./config";
import { EXT_NAME } from "./constants";

export interface DividerContext {
  line: TextLine;
  lang: string;
}

const checkMultiLineSelection = (selection: Selection): void => {
  if (!selection.isSingleLine) throw new DividerError("MULTI_LINE");
};

const checkEmptyLine = (line: TextLine): void => {
  if (line.isEmptyOrWhitespace) throw new DividerError("EMPTY_LINE");
};

export const getEditorContext = (editor: TextEditor): DividerContext => {
  const selection = editor.selection;
  checkMultiLineSelection(selection);

  return {
    lang: editor.document.languageId,
    line: editor.document.lineAt(selection.active.line),
  };
};

export const insertDivider = (type: PresetId, context: DividerContext): void => {
  const { line } = context;
  if (type !== "line") checkEmptyLine(line);

  const content = render(type, line.text, getConfig(type, context.lang));

  const editor = window.activeTextEditor;
  if (!editor) return;

  void editor
    .edit((textEditorEdit) => {
      textEditorEdit.replace(line.range, content);
    })
    .then(() => {
      void commands.executeCommand("cursorEnd");
    });
};

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  EMPTY_LINE: "Line should contain at least one character!",
  MULTI_LINE: "Selection should be on single line!",
  LONG_TEXT: "Too many characters! Increase divider length in settings or use less characters.",
  COMMENT_CHARS: "Line contains comment characters!",
  FILLER_LEN: "Incorrect filler symbol!",
};

export const showError = (e: unknown): void => {
  if (e instanceof DividerError) {
    void window.showInformationMessage(`${EXT_NAME}: ${ERROR_MESSAGES[e.code]}`);
  }
};
