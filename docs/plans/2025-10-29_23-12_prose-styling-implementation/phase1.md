# フェーズ1: スタイル生成関数（見出し・段落・リスト）の実装

## 概要
見出し、段落、リスト要素のスタイル生成関数を実装する。
最も重要な要素から優先的に実装することで、早期に視覚的な改善を実現する。

## サブフェーズ構成
- **フェーズ1.1**: スタイル生成関数（見出し・段落・リスト）の実装
- **フェーズ1.2**: スタイル生成関数（見出し・段落・リスト）のテスト

---

## フェーズ1.1: スタイル生成関数（見出し・段落・リスト）の実装

### 目的
見出し（h1-h6）、段落（p）、リスト（ul, ol, li）のスタイル生成関数を実装する。
純粋関数として実装し、Tailwind CSSクラス文字列を返す。

### 実装内容
- 見出しスタイル生成関数の実装（h1-h6）
- 段落スタイル生成関数の実装
- リストスタイル生成関数の実装（ul, ol, li）
- 型定義の追加

### 主要ファイル

**スタイル生成関数 (`presentation/utils/prose-styles.ts`)**
```typescript
/**
 * 見出しレベルを表す型
 */
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * 見出しタグに適用するスタイルクラスを返す純粋関数
 *
 * 各見出しレベルに対して適切なフォントサイズ、太さ、余白を設定する。
 * レスポンシブ対応（モバイル・デスクトップ）とダークモード対応を含む。
 *
 * **純粋関数の特性:**
 * - 副作用を持たない
 * - 同じ入力に対して常に同じ出力を返す
 * - 外部状態に依存しない
 *
 * @param level - 見出しレベル（1-6）
 * @returns Tailwind CSSクラス文字列
 *
 * @example
 * ```typescript
 * const styles = getHeadingStyles(1);
 * // 結果: "text-3xl md:text-4xl font-bold mt-8 mb-4 text-foreground"
 * ```
 */
export const getHeadingStyles = (level: HeadingLevel): string => {
  const baseStyles = "font-bold mt-8 mb-4 text-foreground";
  
  switch (level) {
    case 1:
      return `${baseStyles} text-3xl md:text-4xl`;
    case 2:
      return `${baseStyles} text-2xl md:text-3xl`;
    case 3:
      return `${baseStyles} text-xl md:text-2xl`;
    case 4:
      return `${baseStyles} text-lg md:text-xl`;
    case 5:
      return `${baseStyles} text-base md:text-lg`;
    case 6:
      return `${baseStyles} text-sm md:text-base`;
    default:
      return baseStyles;
  }
};

/**
 * 段落タグに適用するスタイルクラスを返す純粋関数
 *
 * 読みやすい行間、適切な余白、フォントサイズを設定する。
 *
 * @returns Tailwind CSSクラス文字列
 *
 * @example
 * ```typescript
 * const styles = getParagraphStyles();
 * // 結果: "mb-4 leading-7 text-foreground"
 * ```
 */
export const getParagraphStyles = (): string => {
  return "mb-4 leading-7 text-foreground";
};

/**
 * リストタイプを表す型
 */
type ListType = "ul" | "ol";

/**
 * リストタグに適用するスタイルクラスを返す純粋関数
 *
 * 順序付きリストと順序なしリストで適切なスタイルを設定する。
 * インデント、マーカー、余白を考慮する。
 *
 * @param type - リストタイプ（"ul" または "ol"）
 * @returns Tailwind CSSクラス文字列
 *
 * @example
 * ```typescript
 * const styles = getListStyles("ul");
 * // 結果: "mb-4 ml-6 list-disc space-y-2"
 * ```
 */
export const getListStyles = (type: ListType): string => {
  const baseStyles = "mb-4 ml-6 space-y-2";
  
  if (type === "ul") {
    return `${baseStyles} list-disc`;
  }
  
  // olの場合
  return `${baseStyles} list-decimal`;
};

/**
 * リスト項目タグに適用するスタイルクラスを返す純粋関数
 *
 * リスト項目の余白と行間を設定する。
 *
 * @returns Tailwind CSSクラス文字列
 *
 * @example
 * ```typescript
 * const styles = getListItemStyles();
 * // 結果: "leading-7 text-foreground"
 * ```
 */
export const getListItemStyles = (): string => {
  return "leading-7 text-foreground";
};
```

**エクスポート (`presentation/utils/index.ts`への追加)**
```typescript
export {
  getHeadingStyles,
  getParagraphStyles,
  getListStyles,
  getListItemStyles,
} from "./prose-styles";
```

### 完了条件
- [ ] 見出し（h1-h6）のスタイル生成関数が実装済み
- [ ] 段落（p）のスタイル生成関数が実装済み
- [ ] リスト（ul, ol, li）のスタイル生成関数が実装済み
- [ ] 型エラーが0件
- [ ] TSDocコメントが記述済み
- [ ] レスポンシブ対応が実装済み
- [ ] ダークモード対応が実装済み

### 次のフェーズ
フェーズ1.2: スタイル生成関数（見出し・段落・リスト）のテスト

---

## フェーズ1.2: スタイル生成関数（見出し・段落・リスト）のテスト

### 目的
フェーズ1.1で実装したスタイル生成関数のテストを作成する。

### 実装内容
- 見出しスタイル生成関数のテスト
- 段落スタイル生成関数のテスト
- リストスタイル生成関数のテスト
- エッジケースのテスト

### 主要ファイル

**テストファイル (`presentation/utils/__tests__/prose-styles.node.spec.ts`)**
```typescript
import { describe, it, expect } from "vitest";
import {
  getHeadingStyles,
  getParagraphStyles,
  getListStyles,
  getListItemStyles,
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
  });

  describe("getParagraphStyles", () => {
    it("正しいスタイルを返す", () => {
      const result = getParagraphStyles();
      expect(result).toContain("mb-4");
      expect(result).toContain("leading-7");
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
    });

    it("olタイプで正しいスタイルを返す", () => {
      const result = getListStyles("ol");
      expect(result).toContain("list-decimal");
      expect(result).toContain("mb-4");
    });
  });

  describe("getListItemStyles", () => {
    it("正しいスタイルを返す", () => {
      const result = getListItemStyles();
      expect(result).toContain("leading-7");
    });
  });
});
```

### 完了条件
- [ ] 全てのテストがパスしている
- [ ] テストカバレッジが80%以上
- [ ] 型エラーが0件
- [ ] リントエラーが0件

### 次のフェーズ
フェーズ2.1: スタイル生成関数（リンク・引用・画像）の実装

