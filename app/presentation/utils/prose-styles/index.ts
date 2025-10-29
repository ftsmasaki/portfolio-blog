/**
 * プローススタイル生成関数のモジュール
 *
 * WordPress Gutenbergエディタで生成されるHTML要素に対して、
 * Tailwind CSSによるスタイリングを適用するための純粋関数集。
 *
 * 各カテゴリごとにモジュールを分割しており、拡張性と保守性を重視した設計。
 *
 * @module prose-styles
 */

// 見出しスタイル
export { getHeadingStyles } from "./heading";

// テキストスタイル（段落、太字、斜体、インラインコード）
export {
  getParagraphStyles,
  getStrongStyles,
  getEmStyles,
  getInlineCodeStyles,
} from "./text";

// リストスタイル
export { getListStyles, getListItemStyles } from "./list";

// リンクスタイル
export { getLinkStyles } from "./link";

// メディアスタイル（画像）
export { getImageStyles } from "./media";

// 引用スタイル
export { getQuoteStyles } from "./quote";

// テーブルスタイル
export { getTableStyles } from "./table";

// 型定義の再エクスポート
export type {
  HeadingLevel,
  ListType,
  TableElementType,
} from "./types";
