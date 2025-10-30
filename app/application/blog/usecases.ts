import type { PostRepository } from "@/domain/blog/ports";

/**
 * ブログユースケースの関数ファクトリ
 */

/**
 * 全ての投稿を取得するユースケースを作成
 */
export const createGetPostsUseCase = (repo: PostRepository) => repo.findAll;

/**
 * スラッグで投稿を取得するユースケースを作成
 */
export const createGetPostBySlugUseCase = (repo: PostRepository) =>
  repo.findBySlug;

/**
 * タグスラッグで投稿を取得するユースケースを作成
 */
export const createGetPostsByTagUseCase = (repo: PostRepository) =>
  repo.findByTagSlug;

/**
 * タグIDで投稿を取得するユースケースを作成
 */
export const createGetPostsByTagIdUseCase = (repo: PostRepository) =>
  repo.findByTagId;

/**
 * キーワードで投稿を検索するユースケースを作成
 */
export const createSearchPostsUseCase = (repo: PostRepository) => repo.search;
