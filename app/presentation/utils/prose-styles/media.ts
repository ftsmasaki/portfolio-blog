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
