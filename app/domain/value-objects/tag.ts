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
  if (typeof value !== "string") {
    return E.left(
      "無効なTagSlug: 文字列である必要があります"
    );
  }

  const raw = value.trim();
  if (raw.length === 0 || raw.length > 200) {
    return E.left(
      "無効なTagSlug: 1-200文字である必要があります"
    );
  }

  // パターン1: 素の英数字ハイフン
  const asciiSlugPattern = /^[a-z0-9-]+$/;
  if (asciiSlugPattern.test(raw)) {
    return E.right({ _tag: "TagSlug", value: raw });
  }

  // パターン2: パーセントエンコードを含むスラッグ（%HHの並びとハイフン）
  const percentEncodedPattern = /^(?:[a-z0-9-]|%[0-9A-Fa-f]{2})+$/;
  if (percentEncodedPattern.test(raw)) {
    return E.right({ _tag: "TagSlug", value: raw });
  }

  // パターン3: 非ASCII（日本語等）を含むスラッグ。decode可能か確認のみ。
  try {
    // decodeできる場合もあるが、値としては受け取ったまま保持する
    // （リンク生成やAPI引数側で適切にエンコードされる前提）
    decodeURIComponent(encodeURIComponent(raw));
    return E.right({ _tag: "TagSlug", value: raw });
  } catch {
    return E.left(
      "無効なTagSlug: 英数字・ハイフン、もしくは有効なパーセントエンコード/Unicode文字列である必要があります"
    );
  }
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
