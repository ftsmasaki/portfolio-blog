/**
 * デバッグ出力用ユーティリティ
 */
import { serverEnv } from "@/config/env";

/**
 * デバッグモードが有効かどうかを判定
 * 環境変数 DEBUG_WORDPRESS_API が "true" の場合、または
 * NODE_ENV が "development" の場合は true を返す
 */
export const isDebugMode = (): boolean => {
  const debugEnv = serverEnv.DEBUG_WORDPRESS_API;
  const isDevelopment = serverEnv.NODE_ENV === "development";

  // 明示的に false が設定されている場合は false
  if (debugEnv === "0") {
    return false;
  }

  // 明示的に true が設定されている場合、または開発環境の場合は true
  return debugEnv === "1" || isDevelopment;
};

/**
 * WordPress APIデータのデバッグ出力
 * @param label - 出力ラベル
 * @param data - 出力するデータ
 */
export const debugWordPressApi = <T>(label: string, data: T): void => {
  if (!isDebugMode()) {
    return;
  }

  console.log(`\n🔍 [WordPress API Debug] ${label}`);
  console.log(JSON.stringify(data, null, 2));
  console.log("─".repeat(50));
};

/**
 * ドメインエンティティのデバッグ出力
 * @param label - 出力ラベル
 * @param data - 出力するデータ
 */
export const debugDomainEntity = <T>(label: string, data: T): void => {
  if (!isDebugMode()) {
    return;
  }

  console.log(`\n📦 [Domain Entity Debug] ${label}`);
  console.log(JSON.stringify(data, null, 2));
  console.log("─".repeat(50));
};
