import { describe, it, expect } from "vitest";
import { getListStyles, getListItemStyles } from "../list";
import type { ListType } from "../types";

describe("getListStyles", () => {
  it("ulタイプで正しいスタイルを返す", () => {
    const result = getListStyles("ul");
    expect(result).toContain("list-disc");
    expect(result).toContain("mb-4");
    expect(result).toContain("ml-6");
    expect(result).toContain("space-y-2");
  });

  it("olタイプで正しいスタイルを返す", () => {
    const result = getListStyles("ol");
    expect(result).toContain("list-decimal");
    expect(result).toContain("mb-4");
    expect(result).toContain("ml-6");
    expect(result).toContain("space-y-2");
  });

  it("ulとolで共通のスタイルが含まれる", () => {
    const ulResult = getListStyles("ul");
    const olResult = getListStyles("ol");
    expect(ulResult).toContain("mb-4");
    expect(olResult).toContain("mb-4");
    expect(ulResult).toContain("ml-6");
    expect(olResult).toContain("ml-6");
  });

  it("ulとolで異なるリストマーカーが設定される", () => {
    const ulResult = getListStyles("ul");
    const olResult = getListStyles("ol");
    expect(ulResult).toContain("list-disc");
    expect(olResult).toContain("list-decimal");
    expect(ulResult).not.toContain("list-decimal");
    expect(olResult).not.toContain("list-disc");
  });

  it("同じ入力に対して常に同じ出力を返す（純粋関数）", () => {
    const result1 = getListStyles("ul");
    const result2 = getListStyles("ul");
    expect(result1).toBe(result2);
  });
});

describe("getListItemStyles", () => {
  it("正しいスタイルを返す", () => {
    const result = getListItemStyles();
    expect(result).toContain("leading-7");
    expect(result).toContain("text-foreground");
  });

  it("同じ入力に対して常に同じ出力を返す（純粋関数）", () => {
    const result1 = getListItemStyles();
    const result2 = getListItemStyles();
    expect(result1).toBe(result2);
  });
});
