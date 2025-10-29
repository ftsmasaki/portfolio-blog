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
 * hrefが`NEXT_PUBLIC_APP_URL_LOCAL`または`NEXT_PUBLIC_APP_URL_PRODUCTION`で始まる場合は内部リンク、
 * それ以外は外部リンクと判定する。
 *
 * **純粋関数の特性:**
 * - 副作用を持たない
 * - 同じ入力に対して常に同じ出力を返す
 * - 外部状態に依存しない
 *
 * @param href - リンクのURL文字列
 * @returns 外部リンクの場合はtrue、内部リンクの場合はfalse
 *
 * @example
 * ```typescript
 * isExternalLink("https://example.com/page"); // true
 * isExternalLink("/blog/post"); // true（相対パスは外部リンクと判定）
 * ```
 */
export const isExternalLink = (href: string): boolean => {
  // 環境変数を取得（クライアントサイドで実行される可能性があるため）
  const localUrl = process.env.NEXT_PUBLIC_APP_URL_LOCAL || "";
  const productionUrl = process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || "";

  // 環境変数が設定されていない場合は空文字列になる
  if (!localUrl && !productionUrl) {
    // 環境変数が設定されていない場合、絶対URL（http://またはhttps://で始まる）を外部リンクと判定
    return href.startsWith("http://") || href.startsWith("https://");
  }

  // 内部リンクのURLで始まるかチェック（空文字列の場合はチェックをスキップ）
  const isInternal =
    (localUrl && href.startsWith(localUrl)) ||
    (productionUrl && href.startsWith(productionUrl));

  // 相対パス（/で始まる）も内部リンクとして扱う
  if (href.startsWith("/")) {
    return false;
  }

  // 内部リンクでない場合は外部リンク
  return !isInternal;
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
export const transformLinkAttributes = (href: string): LinkAttributes => {
  if (isExternalLink(href)) {
    return {
      target: "_blank",
      rel: "noopener noreferrer",
    };
  }

  return {};
};
