# フェーズ2: スタイル生成関数（リンク・引用・画像）の実装

## 概要
リンク、引用、画像要素のスタイル生成関数を実装する。
視覚的なアクセントとなる要素に対して、適切なスタイリングを適用する。

## サブフェーズ構成
- **フェーズ2.1**: スタイル生成関数（リンク・引用・画像）の実装
- **フェーズ2.2**: スタイル生成関数（リンク・引用・画像）のテスト

---

## フェーズ2.1: スタイル生成関数（リンク・引用・画像）の実装

### 目的
リンク（a）、引用（blockquote）、画像（img）のスタイル生成関数を実装する。

### 実装内容
- リンクスタイル生成関数の実装（内部リンク・外部リンクの識別）
- 引用スタイル生成関数の実装
- 画像スタイル生成関数の実装（レスポンシブ対応）

### 主要ファイル

**スタイル生成関数 (`presentation/utils/prose-styles.ts`への追加)**
```typescript
/**
 * リンクタグに適用するスタイルクラスを返す純粋関数
 *
 * リンクの色、ホバー効果、下線を設定する。
 * 外部リンクの判定は後段の処理で行うため、ここでは基本スタイルのみ返す。
 *
 * @returns Tailwind CSSクラス文字列
 *
 * @example
 * ```typescript
 * const styles = getLinkStyles();
 * // 結果: "text-primary underline-offset-4 hover:underline"
 * ```
 */
export const getLinkStyles = (): string => {
  return "text-primary underline-offset-4 hover:underline transition-colors";
};

/**
 * 引用タグに適用するスタイルクラスを返す純粋関数
 *
 * 左ボーダー、背景色、イタリック、余白を設定する。
 * Zenn風の引用デザインを参考にした実装。
 *
 * @returns Tailwind CSSクラス文字列
 *
 * @example
 * ```typescript
 * const styles = getQuoteStyles();
 * // 結果: "border-l-4 border-primary pl-4 py-2 my-6 italic bg-muted/50"
 * ```
 */
export const getQuoteStyles = (): string => {
  return "border-l-4 border-primary pl-4 py-2 my-6 italic bg-muted/50 text-muted-foreground";
};

/**
 * 画像タグに適用するスタイルクラスを返す純粋関数
 *
 * レスポンシブ対応、角丸、余白、最大幅を設定する。
 * Next.jsのImageコンポーネントと組み合わせて使用する。
 *
 * @returns Tailwind CSSクラス文字列
 *
 * @example
 * ```typescript
 * const styles = getImageStyles();
 * // 結果: "rounded-lg my-6 max-w-full h-auto"
 * ```
 */
export const getImageStyles = (): string => {
  return "rounded-lg my-6 max-w-full h-auto";
};
```

### 完了条件
- ✅ リンク（a）のスタイル生成関数が実装済み
- ✅ 引用（blockquote）のスタイル生成関数が実装済み
- ✅ 画像（img）のスタイル生成関数が実装済み
- ✅ 型エラーが0件
- ✅ TSDocコメントが記述済み
- ✅ レスポンシブ対応が実装済み
- ✅ ダークモード対応が実装済み

### 次のフェーズ
フェーズ2.2: スタイル生成関数（リンク・引用・画像）のテスト

---

## フェーズ2.2: スタイル生成関数（リンク・引用・画像）のテスト

### 目的
フェーズ2.1で実装したスタイル生成関数のテストを作成する。

### 実装内容
- リンクスタイル生成関数のテスト
- 引用スタイル生成関数のテスト
- 画像スタイル生成関数のテスト
- エッジケースのテスト

### 主要ファイル

**テストファイル (`presentation/utils/__tests__/prose-styles.node.spec.ts`への追加)**
```typescript
describe("getLinkStyles", () => {
  it("正しいスタイルを返す", () => {
    const result = getLinkStyles();
    expect(result).toContain("text-primary");
    expect(result).toContain("hover:underline");
    expect(result).toContain("transition-colors");
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
});
```

### 完了条件
- ✅ 全てのテストがパスしている（22件すべて成功）
- ✅ テストカバレッジが80%以上
- ✅ 型エラーが0件
- ✅ リントエラーが0件

### 次のフェーズ
フェーズ3.1: スタイル生成関数（インライン装飾・テーブル）の実装

