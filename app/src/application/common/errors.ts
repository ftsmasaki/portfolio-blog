/**
 * アプリケーション全体で発生しうるエラーの型定義
 */

/**
 * ネットワークエラー
 */
export type NetworkError = { _tag: "NetworkError"; error: Error };

/**
 * APIエラー
 */
export type ApiError = { _tag: "ApiError"; status: number; message: string };

/**
 * リソース未找到エラー
 */
export type NotFoundError = { _tag: "NotFoundError"; resource: string };

/**
 * バリデーションエラー
 */
export type ValidationError = {
  _tag: "ValidationError";
  field: string;
  message: string;
};

/**
 * 不明なエラー
 */
export type UnknownError = { _tag: "UnknownError"; error: unknown };

/**
 * アプリケーション全体のエラー型
 */
export type AppError =
  | NetworkError
  | ApiError
  | NotFoundError
  | ValidationError
  | UnknownError;

/**
 * ネットワークエラーを生成するコンストラクタ関数
 */
export const networkError = (error: Error): AppError => ({
  _tag: "NetworkError",
  error,
});

/**
 * APIエラーを生成するコンストラクタ関数
 */
export const apiError = (status: number, message: string): AppError => ({
  _tag: "ApiError",
  status,
  message,
});

/**
 * リソース未找到エラーを生成するコンストラクタ関数
 */
export const notFoundError = (resource: string): AppError => ({
  _tag: "NotFoundError",
  resource,
});

/**
 * バリデーションエラーを生成するコンストラクタ関数
 */
export const validationError = (field: string, message: string): AppError => ({
  _tag: "ValidationError",
  field,
  message,
});

/**
 * 不明なエラーを生成するコンストラクタ関数
 */
export const unknownError = (error: unknown): AppError => ({
  _tag: "UnknownError",
  error,
});
