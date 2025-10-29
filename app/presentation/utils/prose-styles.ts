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
