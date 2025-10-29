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
 * // 結果: "border-l-4 border-primary pl-4 py-2 my-6 italic bg-muted/50 text-muted-foreground"
 * ```
 */
export const getQuoteStyles = (): string => {
  return "border-l-4 border-primary pl-4 py-2 my-6 italic bg-muted/50 text-muted-foreground";
};
