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
 * 太字タグに適用するスタイルクラスを返す純粋関数
 *
 * フォントウェイトを太字に設定する。
 *
 * @returns Tailwind CSSクラス文字列
 *
 * @example
 * ```typescript
 * const styles = getStrongStyles();
 * // 結果: "font-bold text-foreground"
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
 * // 結果: "font-mono text-sm bg-muted px-1.5 py-0.5 rounded text-foreground"
 * ```
 */
export const getInlineCodeStyles = (): string => {
  return "font-mono text-sm bg-muted px-1.5 py-0.5 rounded text-foreground";
};
