import type { ListType } from "./types";

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
