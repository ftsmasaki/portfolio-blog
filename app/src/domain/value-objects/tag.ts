import * as E from "fp-ts/Either";

/**
 * タグID値オブジェクト
 */
export interface TagId {
  readonly _tag: "TagId";
  readonly value: number;
}

/**
 * タグIDを作成するコンストラクタ関数
 */
export const createTagId = (value: unknown): E.Either<string, TagId> => {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return E.right({ _tag: "TagId", value });
  }
  return E.left("無効なTagId: 正の整数である必要があります");
};

/**
 * タグ名値オブジェクト
 */
export interface TagName {
  readonly _tag: "TagName";
  readonly value: string;
}

/**
 * タグ名を作成するコンストラクタ関数
 */
export const createTagName = (value: unknown): E.Either<string, TagName> => {
  if (typeof value === "string" && value.length >= 1 && value.length <= 50) {
    return E.right({ _tag: "TagName", value });
  }
  return E.left("無効なTagName: 1-50文字である必要があります");
};

/**
 * タグスラッグ値オブジェクト
 */
export interface TagSlug {
  readonly _tag: "TagSlug";
  readonly value: string;
}

/**
 * タグスラッグを作成するコンストラクタ関数
 */
export const createTagSlug = (value: unknown): E.Either<string, TagSlug> => {
  if (
    typeof value === "string" &&
    value.length >= 1 &&
    value.length <= 100 &&
    /^[a-z0-9-]+$/.test(value)
  ) {
    return E.right({ _tag: "TagSlug", value });
  }
  return E.left(
    "無効なTagSlug: 1-100文字で、小文字英数字とハイフンのみ使用可能です"
  );
};

/**
 * タグカウント値オブジェクト
 */
export interface TagCount {
  readonly _tag: "TagCount";
  readonly value: number;
}

/**
 * タグカウントを作成するコンストラクタ関数
 */
export const createTagCount = (value: unknown): E.Either<string, TagCount> => {
  if (typeof value === "number" && Number.isInteger(value) && value >= 0) {
    return E.right({ _tag: "TagCount", value });
  }
  return E.left("無効なTagCount: 0以上の整数である必要があります");
};
