# Comment Divider

> Divide your code by sections with styled comment separators.

A modern rewrite of [comment-divider](https://github.com/liuweiGL/comment-divider) built with
**Vite + TypeScript** and the **latest VS Code extension APIs**.

## Features

- **Main Header** — a large, block-style section separator.
- **Sub Header** — a compact single-line section separator.
- **Solid Line** — a plain full-width divider line.

Each divider adapts to the current language's comment syntax and supports custom
alignment, filling symbol, vertical style, and text transform. Full-width / CJK
characters are measured by display width so the rendered line aligns perfectly
with the solid lines.

## Usage

Place the cursor on a line and trigger one of the commands (or use the keybindings):

| Command                              | Keybinding    |
| ------------------------------------ | ------------- |
| `Comment Divider: Make Main Header`  | `Alt+Shift+X` |
| `Comment Divider: Make Subheader`    | `Alt+X`       |
| `Comment Divider: Insert Solid Line` | `Alt+Y`       |

## Configuration

See `contributes.configuration` in `package.json` for the full list of settings
(`comment-divider.*`), e.g. `comment-divider.length` (default `80`),
`comment-divider.cjkWidthRatio` (default `2`), per-header filler / height / align /
transform, and `comment-divider.languagesMap` for custom comment limiters.

## Development

```bash
npm install
npm run build     # bundle with Vite into dist/extension.js
npm run watch     # watch mode
npm test          # run unit tests (Vitest)
npm run package   # package into a .vsix
```

The extension is bundled as CommonJS with the `vscode` module externalized. Run
`F5` inside VS Code to launch the Extension Development Host.
