import { describe, it, expect } from "vitest";
import { getImageStyles } from "../media";

describe("getImageStyles", () => {
  it("正しいスタイルを返す", () => {
    const result = getImageStyles();
    expect(result).toContain("rounded-lg");
    expect(result).toContain("max-w-full");
    expect(result).toContain("h-auto");
  });

  it("レスポンシブ対応が含まれる", () => {
    const result = getImageStyles();
    expect(result).toContain("max-w-full");
  });

  it("適切な余白が設定される", () => {
    const result = getImageStyles();
    expect(result).toContain("my-6");
  });

  it("同じ入力に対して常に同じ出力を返す（純粋関数）", () => {
    const result1 = getImageStyles();
    const result2 = getImageStyles();
    expect(result1).toBe(result2);
  });
});
