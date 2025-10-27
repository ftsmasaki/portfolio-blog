import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { httpClient, type HttpError } from "@/infrastructure/http/client";
import type {
  WordPressPost,
  WordPressTag,
} from "@/infrastructure/external/types";

/**
 * WordPress APIエラー型
 */
export interface WordPressApiError {
  readonly message: string;
  readonly status: number;
}

/**
 * 記事一覧を取得する関数
 *
 * @param baseUrl - WordPressのベースURL
 * @param page - ページ番号
 * @param perPage - 1ページあたりの記事数
 * @returns WordPress記事の配列
 */
export const getWordPressPosts = async (
  baseUrl: string,
  page: number = 1,
  perPage: number = 10
): Promise<E.Either<WordPressApiError, WordPressPost[]>> => {
  const url = `${baseUrl}/wp-json/wp/v2/posts?page=${page}&per_page=${perPage}&_embed=true`;

  return pipe(
    await httpClient.get<WordPressPost[]>(url),
    E.map(response => response.data),
    E.mapLeft(
      (httpError: HttpError): WordPressApiError => ({
        message: httpError.message,
        status: httpError.status,
      })
    )
  );
};

/**
 * スラッグで記事を取得する関数
 *
 * @param baseUrl - WordPressのベースURL
 * @param slug - 記事のスラッグ
 * @returns WordPress記事
 */
export const getWordPressPostBySlug = async (
  baseUrl: string,
  slug: string
): Promise<E.Either<WordPressApiError, WordPressPost>> => {
  const url = `${baseUrl}/wp-json/wp/v2/posts?slug=${slug}&_embed=true`;

  return pipe(
    await httpClient.get<WordPressPost[]>(url),
    E.map(response => response.data),
    E.chain(posts => {
      if (posts.length === 0) {
        return E.left<WordPressApiError, WordPressPost>({
          message: "Post not found",
          status: 404,
        });
      }
      return E.right(posts[0]);
    }),
    E.mapLeft(
      (httpError: HttpError): WordPressApiError => ({
        message: httpError.message,
        status: httpError.status,
      })
    )
  );
};

/**
 * 実績一覧を取得する関数
 * カスタム投稿タイプ 'works' を想定
 *
 * @param baseUrl - WordPressのベースURL
 * @param page - ページ番号
 * @param perPage - 1ページあたりの実績数
 * @returns WordPress実績の配列
 */
export const getWordPressWorks = async (
  baseUrl: string,
  page: number = 1,
  perPage: number = 10
): Promise<E.Either<WordPressApiError, WordPressPost[]>> => {
  const url = `${baseUrl}/wp-json/wp/v2/works?page=${page}&per_page=${perPage}&_embed=true`;

  return pipe(
    await httpClient.get<WordPressPost[]>(url),
    E.map(response => response.data),
    E.mapLeft(
      (httpError: HttpError): WordPressApiError => ({
        message: httpError.message,
        status: httpError.status,
      })
    )
  );
};

/**
 * スラッグで実績を取得する関数
 *
 * @param baseUrl - WordPressのベースURL
 * @param slug - 実績のスラッグ
 * @returns WordPress実績
 */
export const getWordPressWorkBySlug = async (
  baseUrl: string,
  slug: string
): Promise<E.Either<WordPressApiError, WordPressPost>> => {
  const url = `${baseUrl}/wp-json/wp/v2/works?slug=${slug}&_embed=true`;

  return pipe(
    await httpClient.get<WordPressPost[]>(url),
    E.map(response => response.data),
    E.chain(posts => {
      if (posts.length === 0) {
        return E.left<WordPressApiError, WordPressPost>({
          message: "Work not found",
          status: 404,
        });
      }
      return E.right(posts[0]);
    }),
    E.mapLeft(
      (httpError: HttpError): WordPressApiError => ({
        message: httpError.message,
        status: httpError.status,
      })
    )
  );
};

/**
 * タグ一覧を取得する関数
 *
 * @param baseUrl - WordPressのベースURL
 * @param perPage - 1ページあたりのタグ数
 * @returns WordPressタグの配列
 */
export const getWordPressTags = async (
  baseUrl: string,
  perPage: number = 100
): Promise<E.Either<WordPressApiError, WordPressTag[]>> => {
  const url = `${baseUrl}/wp-json/wp/v2/tags?per_page=${perPage}&_embed=true`;

  return pipe(
    await httpClient.get<WordPressTag[]>(url),
    E.map(response => response.data),
    E.mapLeft(
      (httpError: HttpError): WordPressApiError => ({
        message: httpError.message,
        status: httpError.status,
      })
    )
  );
};

/**
 * スラッグでタグを取得する関数
 *
 * @param baseUrl - WordPressのベースURL
 * @param slug - タグのスラッグ
 * @returns WordPressタグ
 */
export const getWordPressTagBySlug = async (
  baseUrl: string,
  slug: string
): Promise<E.Either<WordPressApiError, WordPressTag>> => {
  const url = `${baseUrl}/wp-json/wp/v2/tags?slug=${slug}`;

  return pipe(
    await httpClient.get<WordPressTag[]>(url),
    E.map(response => response.data),
    E.chain(tags => {
      if (tags.length === 0) {
        return E.left<WordPressApiError, WordPressTag>({
          message: "Tag not found",
          status: 404,
        });
      }
      return E.right(tags[0]);
    }),
    E.mapLeft(
      (httpError: HttpError): WordPressApiError => ({
        message: httpError.message,
        status: httpError.status,
      })
    )
  );
};
