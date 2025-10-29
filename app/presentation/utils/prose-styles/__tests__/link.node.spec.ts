import { describe, it, expect } from "vitest";
import { getLinkStyles } from "../link";

describe("getLinkStyles", () => {
  it("正しいスタイルを返す", () => {
    const result = getLinkStyles();
    expect(result).toContain("text-blue-600");
    expect(result).toContain("dark:text-blue-400");
    expect(result).toContain("hover:bg-blue-600");
    expect(result).toContain("dark:hover:bg-blue-400");
    expect(result).toContain("hover:text-white");
    expect(result).toContain("transition-all");
    expect(result).toContain("duration-500");
    expect(result).toContain("rounded");
    expect(result).toContain("px-1.5");
    expect(result).toContain("py-0.5");
    // 下線は不要
    expect(result).not.toContain("underline");
  });

  it("同じ入力に対して常に同じ出力を返す（純粋関数）", () => {
    const result1 = getLinkStyles();
    const result2 = getLinkStyles();
    expect(result1).toBe(result2);
  });
});
