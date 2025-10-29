import type { TableElementType } from "./types";

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
 * // 結果: "w-full my-6 border-collapse border border-border overflow-x-auto"
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
