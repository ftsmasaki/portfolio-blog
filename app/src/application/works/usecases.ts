import type { WorkRepository } from "@/domain/works/ports";

/**
 * 実績ユースケースの関数ファクトリ
 */

/**
 * 全ての実績を取得するユースケースを作成
 */
export const createGetWorksUseCase = (repo: WorkRepository) => repo.findAll;

/**
 * スラッグで実績を取得するユースケースを作成
 */
export const createGetWorkBySlugUseCase = (repo: WorkRepository) =>
  repo.findBySlug;
