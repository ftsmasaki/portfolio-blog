import type { TaskEither } from "fp-ts/TaskEither";
import type { AppError } from "@/application/common/errors";
import type { Post } from "@/domain/blog/entities";

/**
 * ブログリポジトリのポート（インターフェース）
 * 依存性の逆転により、ドメイン層がインフラ層に依存しない
 */
export type PostRepository = {
  /**
   * 全ての投稿を取得
   */
  findAll: () => TaskEither<AppError, Post[]>;

  /**
   * スラッグで投稿を取得
   */
  findBySlug: (slug: string) => TaskEither<AppError, Post>;

  /**
   * タグスラッグで投稿を取得
   */
  findByTagSlug: (slug: string) => TaskEither<AppError, Post[]>;

  /**
   * キーワードで投稿を検索
   */
  search: (query: string) => TaskEither<AppError, Post[]>;
};
