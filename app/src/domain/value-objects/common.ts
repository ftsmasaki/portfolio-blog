import * as E from "fp-ts/Either";

/**
 * 画像URL値オブジェクト
 */
export interface ImageUrl {
  readonly _tag: "ImageUrl";
  readonly value: string;
}

/**
 * 画像URLを作成するコンストラクタ関数
 */
export const createImageUrl = (value: unknown): E.Either<string, ImageUrl> => {
  if (typeof value === "string" && value.length > 0) {
    try {
      new URL(value);
      return E.right({ _tag: "ImageUrl", value });
    } catch {
      return E.left("無効なImageUrl: 有効なURLである必要があります");
    }
  }
  return E.left("無効なImageUrl: 空でない文字列である必要があります");
};

/**
 * GitHub URL値オブジェクト
 */
export interface GitHubUrl {
  readonly _tag: "GitHubUrl";
  readonly value: string;
}

/**
 * GitHub URLを作成するコンストラクタ関数
 */
export const createGitHubUrl = (
  value: unknown
): E.Either<string, GitHubUrl> => {
  if (typeof value === "string" && value.length > 0) {
    if (value.startsWith("https://github.com/")) {
      return E.right({ _tag: "GitHubUrl", value });
    }
    return E.left(
      "無効なGitHubUrl: https://github.com/ で始まる必要があります"
    );
  }
  return E.left("無効なGitHubUrl: 空でない文字列である必要があります");
};

/**
 * 公開URL値オブジェクト
 */
export interface LiveUrl {
  readonly _tag: "LiveUrl";
  readonly value: string;
}

/**
 * 公開URLを作成するコンストラクタ関数
 */
export const createLiveUrl = (value: unknown): E.Either<string, LiveUrl> => {
  if (typeof value === "string" && value.length > 0) {
    if (value.startsWith("http://") || value.startsWith("https://")) {
      return E.right({ _tag: "LiveUrl", value });
    }
    return E.left(
      "無効なLiveUrl: http:// または https:// で始まる必要があります"
    );
  }
  return E.left("無効なLiveUrl: 空でない文字列である必要があります");
};
