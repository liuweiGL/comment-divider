import { describe, expect, it } from "vite-plus/test";

import { buildBlock, buildWordsLine } from "../src/core/build";
import { IConfig } from "../src/core/types";
import { getWordsDisplayWidth } from "../src/core/width";

const baseConfig: IConfig = {
  lineLen: 80,
  sym: "-",
  height: "line",
  align: "center",
  transform: "none",
  includeIndent: false,
  cjkWidthRatio: 2,
  limiters: { left: "/*", right: "*/" },
};

// 计算渲染文本两侧留白的显示宽度差（全角按 2 列计）
const gapWidth = (s: string): number =>
  Array.from(s).reduce(
    (w, ch) =>
      w +
      (/[\u1100-\u115f\u2e80-\ua4cf\uac00-\ud7a3\uf900-\ufaff\ufe30-\ufe4f\uff00-\uff60\uffe0-\uffe6]/.test(
        ch,
      )
        ? 2
        : 1),
    0,
  );

const gapBalance = (config: IConfig, words: string): number => {
  const out = buildWordsLine(config, words, "");
  const start = out.indexOf(words);
  const end = start + words.length - 1;
  return gapWidth(out.slice(0, start)) - gapWidth(out.slice(end + 1));
};

const lineDisplayWidth = (line: string): number =>
  Array.from(line).reduce((w, ch) => w + getWordsDisplayWidth(ch, 2), 0);

describe("builders", () => {
  it("中文注释居中：左右留白对称（差不超过 1 列）", () => {
    const diff = gapBalance(baseConfig, "发送短信验证码接口");
    expect(Math.abs(diff)).toBeLessThanOrEqual(1);
  });

  it("全角/ASCII 混合文本居中对称", () => {
    expect(Math.abs(gapBalance(baseConfig, "登录 Login 接口"))).toBeLessThanOrEqual(1);
    expect(Math.abs(gapBalance(baseConfig, "Token 刷新"))).toBeLessThanOrEqual(1);
  });

  it("纯 ASCII 居中对称且行为不变", () => {
    expect(Math.abs(gapBalance(baseConfig, "Hello World"))).toBeLessThanOrEqual(1);
    expect(Math.abs(gapBalance(baseConfig, "init services"))).toBeLessThanOrEqual(1);
  });

  it("block 高度下三行显示宽度一致（上下对齐）", () => {
    const blockConfig: IConfig = { ...baseConfig, sym: "*", height: "block" };
    const lines = buildBlock(blockConfig, "发送短信验证码接口", "").split("\n");
    expect(lines).toHaveLength(3);
    const widths = lines.map(lineDisplayWidth);
    expect(widths.every((w) => w === widths[0])).toBe(true);
  });

  it("block 中中文文本行与实线对齐到 lineLen", () => {
    const blockConfig: IConfig = { ...baseConfig, sym: "*", height: "block" };
    const lines = buildBlock(blockConfig, "发送短信验证码接口", "").split("\n");
    lines.forEach((l) => {
      expect(lineDisplayWidth(l)).toBe(80);
    });
  });
});
