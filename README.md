# Comment Divider

> Divide your code by sections with styled comment separators.

A modern rewrite of [comment-divider](https://github.com/liuweiGL/comment-divider) built with
**Vite + TypeScript** and the **latest VS Code extension APIs**.

## Features

- **Main Header** — a block-style section separator with a title line between two solid lines.
- **Sub Header** — a compact single-line section separator.
- **Solid Line** — a plain full-width divider line.

Each divider adapts to the active language's comment syntax and supports custom line length,
filling symbol, alignment, vertical style, and text transform. Full-width / CJK characters are
measured by display width so text lines always line up with solid lines.

## Usage

Place the cursor on a line and run one of the commands (or use the keybinding):

| Command                             | Keybinding    |
| ----------------------------------- | ------------- |
| `Comment Divider: Make Main Header` | `Alt+Shift+X` |
| `Comment Divider: Make Subheader`   | `Alt+X`       |
| `Comment Divider: Insert Solid Line`| `Alt+Y`       |

### Examples

TypeScript / JavaScript (comment delimiter `/* */`):

```ts
// Main Header (block, centered)
/* ------------------------------------------------------------------ */
/*                            MY SECTION                              */
/* ------------------------------------------------------------------ */

// Sub Header (line, centered)
// --------------------------- MY SECTION ----------------------------

// Solid Line
// ------------------------------------------------------------------
```

Python / Shell (comment delimiter `#`):

```python
# Main Header (block, centered)
# ------------------------------------------------------------------
#                             MY SECTION
# ------------------------------------------------------------------

# Sub Header (line, centered)
# --------------------------- MY SECTION ----------------------------

# Solid Line
# ------------------------------------------------------------------
```

## Configuration

All settings are namespaced under `comment-divider.*`. See `contributes.configuration` in
`package.json` for the canonical definitions.

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `comment-divider.length` | `number` | `80` | Line length for all dividers. |
| `comment-divider.shouldLengthIncludeIndent` | `boolean` | `false` | Shrink the divider by the indent size, or always use a fixed length. |
| `comment-divider.cjkWidthRatio` | `number` | `2` | Display width of one CJK / full-width char relative to a grid cell (lower if your font renders CJK narrower). |
| `comment-divider.mainHeaderFiller` | `string` | `-` | Symbol used to fill the main header lines (one char). |
| `comment-divider.mainHeaderHeight` | `"block" \| "line"` | `block` | Main header vertical style. |
| `comment-divider.mainHeaderAlign` | `"center" \| "left" \| "right"` | `center` | Main header text alignment. |
| `comment-divider.mainHeaderTransform` | `"uppercase" \| "lowercase" \| "titlecase" \| "none"` | `none` | Main header text transform. |
| `comment-divider.subheaderFiller` | `string` | `-` | Symbol used to fill the subheader lines (one char). |
| `comment-divider.subheaderHeight` | `"block" \| "line"` | `line` | Subheader vertical style. |
| `comment-divider.subheaderAlign` | `"center" \| "left" \| "right"` | `center` | Subheader text alignment. |
| `comment-divider.subheaderTransform` | `"uppercase" \| "lowercase" \| "titlecase" \| "none"` | `none` | Subheader text transform. |
| `comment-divider.lineFiller` | `string` | `-` | Symbol used to fill the solid line (one char). |
| `comment-divider.languagesMap` | `object` | — | Override the comment limiters for specific languages. |

### Custom comment limiters

By default each language uses a built-in comment delimiter (e.g. `/* */` for C-like languages,
`#` for Python/Shell, `<!-- -->` for HTML/XML). Override them per language with `languagesMap`:

```json
"comment-divider.languagesMap": {
  "vue": ["<!--", "-->"],
  "rust": ["//", ""]
}
```

## Development

```bash
pnpm install
pnpm build        # bundle with Vite into dist/extension.js
pnpm watch        # watch mode
pnpm lint         # static checks (vite-plus check)
pnpm test         # run unit tests (Vitest)
pnpm package      # package into a .vsix
```

The extension is bundled as CommonJS with the `vscode` module externalized. Run `F5` inside
VS Code to launch the Extension Development Host.