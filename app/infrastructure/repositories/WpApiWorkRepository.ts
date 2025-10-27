import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import type { WorkRepository } from "@/domain/works/ports";
import type { AppError } from "@/application/common/errors";
import type { Work } from "@/domain/works/entities";
import {
  getWordPressWorks,
  getWordPressWorkBySlug,
} from "@/infrastructure/external/wordpress-api";
import {
  mapWordPressWorkToDomain,
  mapWordPressWorksToDomain,
} from "@/infrastructure/mappers/wp-to-work";

/**
 * WordPress APIを利用した実績リポジトリ
 */
export const wpApiWorkRepository: WorkRepository = {
  /**
   * 全ての実績を取得
   */
  findAll: (): TE.TaskEither<AppError, Work[]> => {
    return pipe(
      TE.tryCatch(
        async () => {
          const baseUrl = process.env.WORDPRESS_URL || "";
          const result = await getWordPressWorks(baseUrl);

          if (E.isLeft(result)) {
            throw new Error(`Failed to fetch works: ${result.left.message}`);
          }

          return result.right;
        },
        (error): AppError => ({
          _tag: "NetworkError",
          error: error instanceof Error ? error : new Error("Unknown error"),
        })
      ),
      TE.chain(wpWorks =>
        pipe(
          mapWordPressWorksToDomain(wpWorks),
          TE.fromEither,
          TE.mapLeft(
            (error): AppError => ({
              _tag: "ValidationError",
              field: "works",
              message: error.message,
            })
          )
        )
      )
    );
  },

  /**
   * スラッグで実績を取得
   */
  findBySlug: (slug: string): TE.TaskEither<AppError, Work> => {
    return pipe(
      TE.tryCatch(
        async () => {
          const baseUrl = process.env.WORDPRESS_URL || "";
          const result = await getWordPressWorkBySlug(baseUrl, slug);

          if (E.isLeft(result)) {
            if (result.left.status === 404) {
              throw new Error(`Work not found: ${slug}`);
            }
            throw new Error(`Failed to fetch work: ${result.left.message}`);
          }

          return result.right;
        },
        (error): AppError => ({
          _tag: "NetworkError",
          error: error instanceof Error ? error : new Error("Unknown error"),
        })
      ),
      TE.chain(wpWork =>
        pipe(
          mapWordPressWorkToDomain(wpWork),
          TE.fromEither,
          TE.mapLeft(
            (error): AppError => ({
              _tag: "ValidationError",
              field: "work",
              message: error.message,
            })
          )
        )
      )
    );
  },
};
