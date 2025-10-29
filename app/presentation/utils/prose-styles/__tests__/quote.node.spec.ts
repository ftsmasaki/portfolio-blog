import { describe, it, expect } from "vitest";
import { getQuoteStyles } from "../quote";

describe("getQuoteStyles", () => {
  it("正しいスタイルを返す", () => {
    const result = getQuoteStyles();
    expect(result).toContain("border-l-4");
    expect(result).toContain("border-primary");
    expect(result).toContain("italic");
    expect(result).toContain("bg-muted/50");
    expect(result).toContain("text-muted-foreground");
  });

  it("適切な余白が設定される", () => {
    const result = getQuoteStyles();
    expect(result).toContain("pl-4");
    expect(result).toContain("py-2");
    expect(result).toContain("my-6");
  });

  it("同じ入力に対して常に同じ出力を返す（純粋関数）", () => {
    const result1 = getQuoteStyles();
    const result2 = getQuoteStyles();
    expect(result1).toBe(result2);
  });
});
