import * as E from "fp-ts/Either";

/**
 * ブログ記事ID値オブジェクト
 */
export interface PostId {
  readonly _tag: "PostId";
  readonly value: number;
}

/**
 * ブログ記事IDを作成するコンストラクタ関数
 */
export const createPostId = (value: unknown): E.Either<string, PostId> => {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return E.right({ _tag: "PostId", value });
  }
  return E.left("無効なPostId: 正の整数である必要があります");
};

/**
 * ブログ記事タイトル値オブジェクト
 */
export interface PostTitle {
  readonly _tag: "PostTitle";
  readonly value: string;
}

/**
 * ブログ記事タイトルを作成するコンストラクタ関数
 */
export const createPostTitle = (
  value: unknown
): E.Either<string, PostTitle> => {
  if (typeof value === "string" && value.length >= 1 && value.length <= 200) {
    return E.right({ _tag: "PostTitle", value });
  }
  return E.left("無効なPostTitle: 1-200文字である必要があります");
};

/**
 * ブログ記事スラッグ値オブジェクト
 */
export interface PostSlug {
  readonly _tag: "PostSlug";
  readonly value: string;
}

/**
 * ブログ記事スラッグを作成するコンストラクタ関数
 */
export const createPostSlug = (value: unknown): E.Either<string, PostSlug> => {
  if (
    typeof value === "string" &&
    value.length >= 1 &&
    value.length <= 100 &&
    /^[a-z0-9-]+$/.test(value)
  ) {
    return E.right({ _tag: "PostSlug", value });
  }
  return E.left(
    "無効なPostSlug: 1-100文字で、小文字英数字とハイフンのみ使用可能です"
  );
};

/**
 * ブログ記事要約値オブジェクト
 */
export interface PostExcerpt {
  readonly _tag: "PostExcerpt";
  readonly value: string;
}

/**
 * ブログ記事要約を作成するコンストラクタ関数
 */
export const createPostExcerpt = (
  value: unknown
): E.Either<string, PostExcerpt> => {
  if (typeof value === "string" && value.length >= 0 && value.length <= 500) {
    return E.right({ _tag: "PostExcerpt", value });
  }
  return E.left("無効なPostExcerpt: 0-500文字である必要があります");
};

/**
 * ブログ記事日付値オブジェクト
 */
export interface PostDate {
  readonly _tag: "PostDate";
  readonly value: Date;
}

/**
 * ブログ記事日付を作成するコンストラクタ関数
 */
export const createPostDate = (value: unknown): E.Either<string, PostDate> => {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return E.right({ _tag: "PostDate", value });
  }
  if (typeof value === "string") {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return E.right({ _tag: "PostDate", value: date });
    }
  }
  return E.left("無効なPostDate: 有効な日付である必要があります");
};
