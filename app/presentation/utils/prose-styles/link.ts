/**
 * リンクタグに適用するスタイルクラスを返す純粋関数
 *
 * リンクの色、ホバー効果、下線を設定する。
 * `text-primary`はCSS変数の値が黒に近いため、明示的な色（`text-blue-600`）を使用する。
 * ホバー時には背景色がつき、文字色が反転（白）し、0.5秒のトランジション効果が適用される。
 * 外部リンクの判定は後段の処理で行うため、ここでは基本スタイルのみ返す。
 *
 * @returns Tailwind CSSクラス文字列
 *
 * @example
 * ```typescript
 * const styles = getLinkStyles();
 * // 結果: "text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white transition-all duration-500 rounded px-1.5 py-0.5"
 * ```
 */
export const getLinkStyles = (): string => {
  return "text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white transition-all duration-500 rounded px-1.5 py-0.5";
};
