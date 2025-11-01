/**
 * リンク属性の型定義
 */
export interface LinkAttributes {
  target?: string;
  rel?: string;
}

/**
 * リンクが外部リンクかどうかを判定する純粋関数
 *
 * 判定ルール:
 * - 相対パス（`/`で始まる）は内部リンクとして扱う
 * - 絶対URLは、`currentOrigin` と同一オリジンなら内部、それ以外は外部
 * - `currentOrigin` が未提供の場合は絶対URLを外部とみなす（保守的判定）
 *
 * **純粋関数の特性:**
 * - 副作用を持たない
 * - 同じ入力に対して常に同じ出力を返す
 * - 外部状態に依存しない（環境変数や `window.location` を参照しない）
 *
 * @param href - リンクのURL文字列
 * @param currentOrigin - 現在のサイトのオリジン（例: "https://example.com"）
 * @returns 外部リンクの場合はtrue、内部リンクの場合はfalse
 *
 * @example
 * ```typescript
 * isExternalLink("/blog/post", "https://example.com"); // false
 * isExternalLink("https://example.com/page", "https://example.com"); // false
 * isExternalLink("https://google.com", "https://example.com"); // true
 * ```
 */
export const isExternalLink = (
  href: string,
  currentOrigin?: string
): boolean => {
  // 相対パス（/で始まる）は内部リンク
  if (href.startsWith("/")) {
    return false;
  }

  // 絶対URLかどうかを判定
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    // `https://` や `http://` で始まらない相対URL（例: "blog/post"）は外部とみなす
    // （安全側の判定。必要に応じて呼び出し側で正規化する）
    return true;
  }

  // currentOrigin が与えられていない場合、絶対URLは外部とみなす
  if (!currentOrigin) {
    return true;
  }

  try {
    const base = new URL(currentOrigin);
    const isSameOrigin =
      url.protocol === base.protocol &&
      url.hostname === base.hostname &&
      // 空文字のポートはデフォルト扱いなので、そのまま比較
      url.port === base.port;
    return !isSameOrigin;
  } catch {
    // currentOrigin が不正な場合は外部とみなす
    return true;
  }
};

/**
 * リンクのhrefに基づいて外部リンク属性を生成する純粋関数
 *
 * 外部リンクの場合は`target="_blank"`と`rel="noopener noreferrer"`を返し、
 * 内部リンクの場合は空オブジェクトを返す。
 *
 * **純粋関数の特性:**
 * - 副作用を持たない
 * - 同じ入力に対して常に同じ出力を返す
 * - 外部状態に依存しない
 *
 * @param href - リンクのURL文字列
 * @returns 外部リンクの場合は`{ target: "_blank", rel: "noopener noreferrer" }`、内部リンクの場合は`{}`
 *
 * @example
 * ```typescript
 * transformLinkAttributes("https://example.com/page");
 * // 結果: { target: "_blank", rel: "noopener noreferrer" }
 *
 * transformLinkAttributes("/blog/post");
 * // 結果: {}
 * ```
 */
export const transformLinkAttributes = (
  href: string,
  currentOrigin?: string
): LinkAttributes => {
  if (isExternalLink(href, currentOrigin)) {
    return {
      target: "_blank",
      rel: "noopener noreferrer",
    };
  }

  return {};
};
