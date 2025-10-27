/**
 * WordPress REST API レスポンス型定義
 */

/**
 * WordPress記事のレスポンス型
 */
export interface WordPressPost {
  readonly id: number;
  readonly slug: string;
  readonly title: {
    readonly rendered: string;
  };
  readonly content: {
    readonly rendered: string;
  };
  readonly excerpt: {
    readonly rendered: string;
  };
  readonly date: string;
  readonly modified: string;
  readonly featured_media: number;
  readonly tags?: number[];
  readonly _embedded?: {
    readonly "wp:featuredmedia"?: Array<{
      readonly source_url: string;
    }>;
    readonly "wp:term"?: Array<
      Array<{
        readonly id: number;
        readonly name: string;
        readonly slug: string;
        readonly taxonomy: string;
      }>
    >;
  };
}

/**
 * WordPressタグのレスポンス型
 */
export interface WordPressTag {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly taxonomy: string;
  readonly count: number;
}

/**
 * WordPressエラーレスポンス型
 */
export interface WordPressError {
  readonly code: string;
  readonly message: string;
  readonly data: {
    readonly status: number;
  };
}
