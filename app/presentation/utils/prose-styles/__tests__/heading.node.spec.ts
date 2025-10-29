import { describe, it, expect } from "vitest";
import { getHeadingStyles } from "../heading";
import type { HeadingLevel } from "../types";

describe("getHeadingStyles", () => {
  it("h1レベルで正しいスタイルを返す", () => {
    const result = getHeadingStyles(1);
    expect(result).toContain("text-3xl");
    expect(result).toContain("md:text-4xl");
    expect(result).toContain("font-bold");
  });

  it("h6レベルで正しいスタイルを返す", () => {
    const result = getHeadingStyles(6);
    expect(result).toContain("text-sm");
    expect(result).toContain("md:text-base");
  });

  it("全てのレベルでfont-boldが含まれる", () => {
    for (let level = 1; level <= 6; level++) {
      const result = getHeadingStyles(level as HeadingLevel);
      expect(result).toContain("font-bold");
    }
  });

  it("全てのレベルでmt-8とmb-4が含まれる", () => {
    for (let level = 1; level <= 6; level++) {
      const result = getHeadingStyles(level as HeadingLevel);
      expect(result).toContain("mt-8");
      expect(result).toContain("mb-4");
    }
  });

  it("全てのレベルでtext-foregroundが含まれる", () => {
    for (let level = 1; level <= 6; level++) {
      const result = getHeadingStyles(level as HeadingLevel);
      expect(result).toContain("text-foreground");
    }
  });

  it("同じ入力に対して常に同じ出力を返す（純粋関数）", () => {
    const result1 = getHeadingStyles(1);
    const result2 = getHeadingStyles(1);
    expect(result1).toBe(result2);
  });
});
