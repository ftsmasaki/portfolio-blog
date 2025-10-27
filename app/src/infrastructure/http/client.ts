import * as E from "fp-ts/Either";
import { tryCatch } from "fp-ts/TaskEither";

/**
 * HTTPレスポンス型
 */
export interface HttpResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

/**
 * HTTPエラー型
 */
export interface HttpError {
  message: string;
  status: number;
  data?: unknown;
}

/**
 * HTTPクライアント関数
 * fetchのラッパーとして実装し、Either型でエラーハンドリングを行う
 */
export const httpClient = {
  /**
   * GETリクエストを送信
   * @param url - リクエストURL
   * @param options - fetchオプション
   * @returns Either<HttpError, HttpResponse<T>>
   */
  get: async <T>(
    url: string,
    options?: RequestInit
  ): Promise<E.Either<HttpError, HttpResponse<T>>> => {
    return await tryCatch(
      async () => {
        const response = await fetch(url, { method: "GET", ...options });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return {
          data,
          status: response.status,
          headers: response.headers,
        };
      },
      error => ({
        message: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      })
    )();
  },

  /**
   * POSTリクエストを送信
   * @param url - リクエストURL
   * @param body - リクエストボディ
   * @param options - fetchオプション
   * @returns Either<HttpError, HttpResponse<T>>
   */
  post: async <T>(
    url: string,
    body: unknown,
    options?: RequestInit
  ): Promise<E.Either<HttpError, HttpResponse<T>>> => {
    return await tryCatch(
      async () => {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...options?.headers },
          body: JSON.stringify(body),
          ...options,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return {
          data,
          status: response.status,
          headers: response.headers,
        };
      },
      error => ({
        message: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      })
    )();
  },
};
