import { describe, it, expect } from "vitest";
import { getTableStyles } from "../table";
import type { TableElementType } from "../types";

describe("getTableStyles", () => {
  it("tableタイプで正しいスタイルを返す", () => {
    const result = getTableStyles("table");
    expect(result).toContain("w-full");
    expect(result).toContain("border-collapse");
    expect(result).toContain("border");
    expect(result).toContain("overflow-x-auto");
  });

  it("theadタイプで正しいスタイルを返す", () => {
    const result = getTableStyles("thead");
    expect(result).toContain("bg-muted");
  });

  it("tbodyタイプで空文字列を返す", () => {
    const result = getTableStyles("tbody");
    expect(result).toBe("");
  });

  it("trタイプで正しいスタイルを返す", () => {
    const result = getTableStyles("tr");
    expect(result).toContain("border-b");
    expect(result).toContain("hover:bg-muted/50");
    expect(result).toContain("transition-colors");
  });

  it("thタイプで正しいスタイルを返す", () => {
    const result = getTableStyles("th");
    expect(result).toContain("font-bold");
    expect(result).toContain("px-4");
    expect(result).toContain("py-2");
    expect(result).toContain("text-left");
  });

  it("tdタイプで正しいスタイルを返す", () => {
    const result = getTableStyles("td");
    expect(result).toContain("px-4");
    expect(result).toContain("py-2");
    expect(result).toContain("border");
  });

  it("全てのテーブル要素タイプでスタイルが返される", () => {
    const types: TableElementType[] = [
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ];
    types.forEach(type => {
      const result = getTableStyles(type);
      expect(typeof result).toBe("string");
    });
  });

  it("同じ入力に対して常に同じ出力を返す（純粋関数）", () => {
    const result1 = getTableStyles("table");
    const result2 = getTableStyles("table");
    expect(result1).toBe(result2);
  });
});
