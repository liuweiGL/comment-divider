import { commands, window, type Range, type Selection, type TextEditor } from "vscode";

import { render } from "../application/render";
import { DividerError, ErrorCode } from "../core/errors";
import { PresetId } from "../core/types";
import { getConfig } from "./config";
import { EXT_NAME } from "./constants";

export interface DividerContext {
  text: string;
  range: Range;
  lang: string;
}

const checkMultiLineSelection = (selection: Selection, type: PresetId): void => {
  // Only the main header (block separator) may span multiple lines.
  if (!selection.isSingleLine && type !== "mainHeader") throw new DividerError("MULTI_LINE");
};

const checkEmptyLine = (text: string): void => {
  if (!text.trim()) throw new DividerError("EMPTY_LINE");
};

export const getEditorContext = (editor: TextEditor, type: PresetId): DividerContext => {
  const selection = editor.selection;
  checkMultiLineSelection(selection, type);

  const multiLine = !selection.isSingleLine;
  const line = editor.document.lineAt(selection.active.line);

  const text = multiLine ? editor.document.getText(selection) : line.text;
  if (type !== "line") checkEmptyLine(text);

  return {
    lang: editor.document.languageId,
    text,
    range: multiLine ? selection : line.range,
  };
};

export const insertDivider = (type: PresetId, context: DividerContext): void => {
  const { text, range } = context;

  const content = render(type, text, getConfig(type, context.lang));

  const editor = window.activeTextEditor;
  if (!editor) return;

  void editor
    .edit((textEditorEdit) => {
      textEditorEdit.replace(range, content);
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
