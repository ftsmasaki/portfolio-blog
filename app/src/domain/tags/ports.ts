import type { TaskEither } from "fp-ts/TaskEither";
import type { AppError } from "@/application/common/errors";
import type { Tag } from "./entities";

/**
 * タグリポジトリのポート（インターフェース）
 * 依存性の逆転により、ドメイン層がインフラ層に依存しない
 */
export type TagRepository = {
  /**
   * 全てのタグを取得
   */
  findAll: () => TaskEither<AppError, Tag[]>;

  /**
   * スラッグでタグを取得
   */
  findBySlug: (slug: string) => TaskEither<AppError, Tag>;
};
