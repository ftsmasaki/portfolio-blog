import type { TagRepository } from "@/domain/tags/ports";

/**
 * タグユースケースの関数ファクトリ
 */

/**
 * 全てのタグを取得するユースケースを作成
 */
export const createGetTagsUseCase = (repo: TagRepository) => repo.findAll;

/**
 * スラッグでタグを取得するユースケースを作成
 */
export const createGetTagBySlugUseCase = (repo: TagRepository) =>
  repo.findBySlug;
