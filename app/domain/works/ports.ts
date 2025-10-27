import type { TaskEither } from "fp-ts/TaskEither";
import type { AppError } from "@/application/common/errors";
import type { Work } from "@/domain/works/entities";

/**
 * 実績リポジトリのポート（インターフェース）
 * 依存性の逆転により、ドメイン層がインフラ層に依存しない
 */
export type WorkRepository = {
  /**
   * 全ての実績を取得
   */
  findAll: () => TaskEither<AppError, Work[]>;

  /**
   * スラッグで実績を取得
   */
  findBySlug: (slug: string) => TaskEither<AppError, Work>;
};
