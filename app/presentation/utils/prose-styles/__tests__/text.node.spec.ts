import { describe, it, expect } from "vitest";
import {
  getParagraphStyles,
  getStrongStyles,
  getEmStyles,
  getInlineCodeStyles,
} from "../text";

describe("getParagraphStyles", () => {
  it("正しいスタイルを返す", () => {
    const result = getParagraphStyles();
    expect(result).toContain("mb-4");
    expect(result).toContain("leading-7");
    expect(result).toContain("text-foreground");
  });

  it("同じ入力に対して常に同じ出力を返す（純粋関数）", () => {
    const result1 = getParagraphStyles();
    const result2 = getParagraphStyles();
    expect(result1).toBe(result2);
  });
});

describe("getStrongStyles", () => {
  it("正しいスタイルを返す", () => {
    const result = getStrongStyles();
    expect(result).toContain("font-bold");
    expect(result).toContain("text-foreground");
  });

  it("同じ入力に対して常に同じ出力を返す（純粋関数）", () => {
    const result1 = getStrongStyles();
    const result2 = getStrongStyles();
    expect(result1).toBe(result2);
  });
});

describe("getEmStyles", () => {
  it("正しいスタイルを返す", () => {
    const result = getEmStyles();
    expect(result).toContain("italic");
  });

  it("同じ入力に対して常に同じ出力を返す（純粋関数）", () => {
    const result1 = getEmStyles();
    const result2 = getEmStyles();
    expect(result1).toBe(result2);
  });
});

describe("getInlineCodeStyles", () => {
  it("正しいスタイルを返す", () => {
    const result = getInlineCodeStyles();
    expect(result).toContain("font-mono");
    expect(result).toContain("bg-muted");
    expect(result).toContain("rounded");
    expect(result).toContain("text-foreground");
  });

  it("適切なパディングが設定される", () => {
    const result = getInlineCodeStyles();
    expect(result).toContain("px-1.5");
    expect(result).toContain("py-0.5");
  });

  it("同じ入力に対して常に同じ出力を返す（純粋関数）", () => {
    const result1 = getInlineCodeStyles();
    const result2 = getInlineCodeStyles();
    expect(result1).toBe(result2);
  });
});
