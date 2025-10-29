# フェーズ3: スタイル生成関数（インライン装飾・テーブル）の実装

## 概要
インライン装飾（strong, em, code）とテーブル要素のスタイル生成関数を実装する。
テーブルはshadcn/uiのTableコンポーネントを使用せず、Tailwind CSSのみでスタイリングする。

## サブフェーズ構成
- **フェーズ3.1**: スタイル生成関数（インライン装飾・テーブル）の実装
- **フェーズ3.2**: スタイル生成関数（インライン装飾・テーブル）のテスト

---

## フェーズ3.1: スタイル生成関数（インライン装飾・テーブル）の実装

### 目的
インライン装飾（strong, em, code）とテーブル要素のスタイル生成関数を実装する。

### 実装内容
- インライン装飾スタイル生成関数の実装
- テーブルスタイル生成関数の実装（Tailwind CSSのみ）

### 主要ファイル

**スタイル生成関数 (`presentation/utils/prose-styles.ts`への追加)**
```typescript
/**
 * 太字タグに適用するスタイルクラスを返す純粋関数
 *
 * フォントウェイトを太字に設定する。
 *
 * @returns Tailwind CSSクラス文字列
 *
 * @example
 * ```typescript
 * const styles = getStrongStyles();
 * // 結果: "font-bold"
 * ```
 */
export const getStrongStyles = (): string => {
  return "font-bold text-foreground";
};

/**
 * 斜体タグに適用するスタイルクラスを返す純粋関数
 *
 * イタリックスタイルを設定する。
 *
 * @returns Tailwind CSSクラス文字列
 *
 * @example
 * ```typescript
 * const styles = getEmStyles();
 * // 結果: "italic"
 * ```
 */
export const getEmStyles = (): string => {
  return "italic";
};

/**
 * インラインコードタグに適用するスタイルクラスを返す純粋関数
 *
 * モノスペースフォント、背景色、パディング、角丸を設定する。
 * ブロックコード（pre > code）とは区別する。
 *
 * @returns Tailwind CSSクラス文字列
 *
 * @example
 * ```typescript
 * const styles = getInlineCodeStyles();
 * // 結果: "font-mono text-sm bg-muted px-1.5 py-0.5 rounded"
 * ```
 */
export const getInlineCodeStyles = (): string => {
  return "font-mono text-sm bg-muted px-1.5 py-0.5 rounded text-foreground";
};

/**
 * テーブル要素のタイプを表す型
 */
type TableElementType = "table" | "thead" | "tbody" | "tr" | "th" | "td";

/**
 * テーブル要素に適用するスタイルクラスを返す純粋関数
 *
 * テーブル要素全体に対して一貫したスタイリングを適用する。
 * shadcn/uiのTableコンポーネントは使用せず、Tailwind CSSのみで実装。
 *
 * **テーブルスタイリング方針:**
 * - ボーダーでセルを区切る
 * - ヘッダー行を強調
 * - ストライプ行（交互の背景色）
 * - レスポンシブ対応（横スクロール）
 *
 * @param elementType - テーブル要素のタイプ
 * @returns Tailwind CSSクラス文字列
 *
 * @example
 * ```typescript
 * const styles = getTableStyles("table");
 * // 結果: "w-full my-6 border-collapse border border-border"
 * ```
 */
export const getTableStyles = (elementType: TableElementType): string => {
  switch (elementType) {
    case "table":
      return "w-full my-6 border-collapse border border-border overflow-x-auto";
    case "thead":
      return "bg-muted";
    case "tbody":
      return "";
    case "tr":
      return "border-b border-border hover:bg-muted/50 transition-colors";
    case "th":
      return "px-4 py-2 text-left font-bold text-foreground border border-border";
    case "td":
      return "px-4 py-2 text-foreground border border-border";
    default:
      return "";
  }
};
```

**エクスポート (`presentation/utils/index.ts`への追加)**
```typescript
export {
  // 既存のエクスポート
  getHeadingStyles,
  getParagraphStyles,
  getListStyles,
  getListItemStyles,
  getLinkStyles,
  getQuoteStyles,
  getImageStyles,
  // 新規追加
  getStrongStyles,
  getEmStyles,
  getInlineCodeStyles,
  getTableStyles,
} from "./prose-styles";
```

### 完了条件
- [ ] インライン装飾（strong, em, code）のスタイル生成関数が実装済み
- [ ] テーブル（table系）のスタイル生成関数が実装済み
- [ ] 型エラーが0件
- [ ] TSDocコメントが記述済み
- [ ] レスポンシブ対応が実装済み
- [ ] ダークモード対応が実装済み

### 次のフェーズ
フェーズ3.2: スタイル生成関数（インライン装飾・テーブル）のテスト

---

## フェーズ3.2: スタイル生成関数（インライン装飾・テーブル）のテスト

### 目的
フェーズ3.1で実装したスタイル生成関数のテストを作成する。

### 実装内容
- インライン装飾スタイル生成関数のテスト
- テーブルスタイル生成関数のテスト
- エッジケースのテスト

### 主要ファイル

**テストファイル (`presentation/utils/__tests__/prose-styles.node.spec.ts`への追加)**
```typescript
describe("getStrongStyles", () => {
  it("正しいスタイルを返す", () => {
    const result = getStrongStyles();
    expect(result).toContain("font-bold");
  });
});

describe("getEmStyles", () => {
  it("正しいスタイルを返す", () => {
    const result = getEmStyles();
    expect(result).toContain("italic");
  });
});

describe("getInlineCodeStyles", () => {
  it("正しいスタイルを返す", () => {
    const result = getInlineCodeStyles();
    expect(result).toContain("font-mono");
    expect(result).toContain("bg-muted");
    expect(result).toContain("rounded");
  });
});

describe("getTableStyles", () => {
  it("tableタイプで正しいスタイルを返す", () => {
    const result = getTableStyles("table");
    expect(result).toContain("w-full");
    expect(result).toContain("border-collapse");
    expect(result).toContain("border");
  });

  it("theadタイプで正しいスタイルを返す", () => {
    const result = getTableStyles("thead");
    expect(result).toContain("bg-muted");
  });

  it("trタイプで正しいスタイルを返す", () => {
    const result = getTableStyles("tr");
    expect(result).toContain("border-b");
    expect(result).toContain("hover:bg-muted/50");
  });

  it("thタイプで正しいスタイルを返す", () => {
    const result = getTableStyles("th");
    expect(result).toContain("font-bold");
    expect(result).toContain("px-4");
  });

  it("tdタイプで正しいスタイルを返す", () => {
    const result = getTableStyles("td");
    expect(result).toContain("px-4");
    expect(result).toContain("border");
  });

  it("全てのテーブル要素タイプでスタイルが返される", () => {
    const types: TableElementType[] = ["table", "thead", "tbody", "tr", "th", "td"];
    types.forEach((type) => {
      const result = getTableStyles(type);
      expect(typeof result).toBe("string");
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
フェーズ4.1: HTML変換処理へのスタイル適用統合

