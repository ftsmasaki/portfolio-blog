import { format, formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

/**
 * 日付をフォーマットする関数
 * @param date - フォーマットする日付
 * @param formatStr - フォーマット文字列（デフォルト: 'yyyy年MM月dd日'）
 * @returns フォーマットされた日付文字列
 */
export const formatDate = (
  date: Date,
  formatStr: string = "yyyy年MM月dd日"
): string => {
  return format(date, formatStr, { locale: ja });
};

/**
 * 日付を相対的に表示する関数（例: "3日前"）
 * @param date - 対象の日付
 * @returns 相対的な日付文字列
 */
export const getRelativeDate = (date: Date): string => {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: ja,
  });
};

/**
 * ISO文字列をDateオブジェクトに変換する関数
 * @param dateString - ISO形式の日付文字列
 * @returns Dateオブジェクト
 */
export const parseISO = (dateString: string): Date => {
  return new Date(dateString);
};

/**
 * 日付から年のみを取得する関数
 * @param date - 対象の日付
 * @returns 年の文字列（例: "2024"）
 */
export const formatYear = (date: Date): string => {
  return format(date, "yyyy", { locale: ja });
};

/**
 * 日付から月と年を取得する関数
 * @param date - 対象の日付
 * @returns 年月の文字列（例: "2024年10月"）
 */
export const formatYearMonth = (date: Date): string => {
  return format(date, "yyyy年MM月", { locale: ja });
};

/**
 * 短い日付形式を返す関数（例: "10/27"）
 * @param date - 対象の日付
 * @returns 短い日付文字列
 */
export const formatShortDate = (date: Date): string => {
  return format(date, "M/d", { locale: ja });
};
