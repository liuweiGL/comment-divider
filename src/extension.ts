import { commands, ExtensionContext } from "vscode";

import { mainHeaderCommand, solidLineCommand, subHeaderCommand } from "./infra/commands";
import { EXT_ID } from "./infra/constants";

export function activate(context: ExtensionContext): void {
  context.subscriptions.push(
    commands.registerCommand(`${EXT_ID}.makeMainHeader`, mainHeaderCommand),
  );
  context.subscriptions.push(commands.registerCommand(`${EXT_ID}.makeSubHeader`, subHeaderCommand));
  context.subscriptions.push(
    commands.registerCommand(`${EXT_ID}.insertSolidLine`, solidLineCommand),
  );
}

export function deactivate(): void {
  // No resources to dispose — registered commands are tied to `context.subscriptions`.
}
