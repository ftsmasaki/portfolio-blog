import type { HeadingLevel } from "./types";

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
