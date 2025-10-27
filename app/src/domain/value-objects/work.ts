import * as E from "fp-ts/Either";

/**
 * 実績ID値オブジェクト
 */
export interface WorkId {
  readonly _tag: "WorkId";
  readonly value: number;
}

/**
 * 実績IDを作成するコンストラクタ関数
 */
export const createWorkId = (value: unknown): E.Either<string, WorkId> => {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return E.right({ _tag: "WorkId", value });
  }
  return E.left("無効なWorkId: 正の整数である必要があります");
};

/**
 * 実績タイトル値オブジェクト
 */
export interface WorkTitle {
  readonly _tag: "WorkTitle";
  readonly value: string;
}

/**
 * 実績タイトルを作成するコンストラクタ関数
 */
export const createWorkTitle = (
  value: unknown
): E.Either<string, WorkTitle> => {
  if (typeof value === "string" && value.length >= 1 && value.length <= 200) {
    return E.right({ _tag: "WorkTitle", value });
  }
  return E.left("無効なWorkTitle: 1-200文字である必要があります");
};

/**
 * 実績説明値オブジェクト
 */
export interface WorkDescription {
  readonly _tag: "WorkDescription";
  readonly value: string;
}

/**
 * 実績説明を作成するコンストラクタ関数
 */
export const createWorkDescription = (
  value: unknown
): E.Either<string, WorkDescription> => {
  if (typeof value === "string" && value.length >= 0 && value.length <= 1000) {
    return E.right({ _tag: "WorkDescription", value });
  }
  return E.left("無効なWorkDescription: 0-1000文字である必要があります");
};

/**
 * 技術値オブジェクト
 */
export interface Technology {
  readonly _tag: "Technology";
  readonly value: string;
}

/**
 * 技術を作成するコンストラクタ関数
 */
export const createTechnology = (
  value: unknown
): E.Either<string, Technology> => {
  if (typeof value === "string" && value.length >= 1 && value.length <= 100) {
    return E.right({ _tag: "Technology", value });
  }
  return E.left("無効なTechnology: 1-100文字である必要があります");
};
