/**
 * ベースURLの末尾スラッシュを除去
 * 例: https://example.com/ -> https://example.com
 */
export function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * ベースURLとパスを連結（重複スラッシュを避ける）
 */
export function joinUrl(base: string, path: string): string {
  const b = stripTrailingSlash(base);
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}
