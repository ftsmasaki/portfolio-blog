import { describe, it, expect } from "vitest";
import {
  getHeadingStyles,
  getParagraphStyles,
  getListStyles,
  getListItemStyles,
  getLinkStyles,
  getQuoteStyles,
  getImageStyles,
  getStrongStyles,
  getEmStyles,
  getInlineCodeStyles,
  getTableStyles,
  type TableElementType,
} from "../prose-styles";

describe("prose-styles", () => {
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
        const result = getHeadingStyles(level as 1 | 2 | 3 | 4 | 5 | 6);
        expect(result).toContain("font-bold");
      }
    });

    it("全てのレベルでmt-8とmb-4が含まれる", () => {
      for (let level = 1; level <= 6; level++) {
        const result = getHeadingStyles(level as 1 | 2 | 3 | 4 | 5 | 6);
        expect(result).toContain("mt-8");
        expect(result).toContain("mb-4");
      }
    });

    it("全てのレベルでtext-foregroundが含まれる", () => {
      for (let level = 1; level <= 6; level++) {
        const result = getHeadingStyles(level as 1 | 2 | 3 | 4 | 5 | 6);
        expect(result).toContain("text-foreground");
      }
    });
  });

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
  });
});
