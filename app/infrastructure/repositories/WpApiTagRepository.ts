import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import type { TagRepository } from "@/domain/tags/ports";
import type { AppError } from "@/application/common/errors";
import type { Tag } from "@/domain/tags/entities";
import {
  getWordPressTags,
  getWordPressTagBySlug,
} from "@/infrastructure/external/wordpress-api";
import {
  mapWordPressTagToDomain,
  mapWordPressTagsToDomain,
} from "@/infrastructure/mappers/wp-to-tag";
import { serverEnv } from "@/config/env";

/**
 * WordPress APIを利用したタグリポジトリ
 */
export const wpApiTagRepository: TagRepository = {
  /**
   * 全てのタグを取得
   */
  findAll: (): TE.TaskEither<AppError, Tag[]> => {
    return pipe(
      TE.tryCatch(
        async () => {
          const baseUrl = serverEnv.WORDPRESS_URL;
          const result = await getWordPressTags(baseUrl);

          if (E.isLeft(result)) {
            throw new Error(`Failed to fetch tags: ${result.left.message}`);
          }

          return result.right;
        },
        (error): AppError => ({
          _tag: "NetworkError",
          error: error instanceof Error ? error : new Error("Unknown error"),
        })
      ),
      TE.chain(wpTags =>
        pipe(
          mapWordPressTagsToDomain(wpTags),
          TE.fromEither,
          TE.mapLeft(
            (error): AppError => ({
              _tag: "ValidationError",
              field: "tags",
              message: error.message,
            })
          )
        )
      )
    );
  },

  /**
   * スラッグでタグを取得
   */
  findBySlug: (slug: string): TE.TaskEither<AppError, Tag> => {
    return pipe(
      TE.tryCatch(
        async () => {
          const baseUrl = serverEnv.WORDPRESS_URL || "";
          const result = await getWordPressTagBySlug(baseUrl, slug);

          if (E.isLeft(result)) {
            if (result.left.status === 404) {
              throw new Error(`Tag not found: ${slug}`);
            }
            throw new Error(`Failed to fetch tag: ${result.left.message}`);
          }

          return result.right;
        },
        (error): AppError => ({
          _tag: "NetworkError",
          error: error instanceof Error ? error : new Error("Unknown error"),
        })
      ),
      TE.chain(wpTag =>
        pipe(
          mapWordPressTagToDomain(wpTag),
          TE.fromEither,
          TE.mapLeft(
            (error): AppError => ({
              _tag: "ValidationError",
              field: "tag",
              message: error.message,
            })
          )
        )
      )
    );
  },
};
