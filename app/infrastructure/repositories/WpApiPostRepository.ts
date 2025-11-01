import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import type { PostRepository } from "@/domain/blog/ports";
import type { AppError } from "@/application/common/errors";
import type { Post } from "@/domain/blog/entities";
import {
  getWordPressPosts,
  getWordPressPostBySlug,
  getWordPressPostsByTagId,
} from "@/infrastructure/external/wordpress-api";
import { serverEnv } from "@/config/env";
import {
  mapWordPressPostToDomain,
  mapWordPressPostsToDomain,
} from "@/infrastructure/mappers/wp-to-post";

/**
 * WordPress APIを利用したブログリポジトリ
 */
export const wpApiPostRepository: PostRepository = {
  /**
   * 全ての投稿を取得
   */
  findAll: (): TE.TaskEither<AppError, Post[]> => {
    return pipe(
      TE.tryCatch(
        async () => {
          const baseUrl = serverEnv.WORDPRESS_URL;
          const result = await getWordPressPosts(baseUrl);

          if (E.isLeft(result)) {
            throw new Error(`Failed to fetch posts: ${result.left.message}`);
          }

          return result.right;
        },
        (error): AppError => ({
          _tag: "NetworkError",
          error: error instanceof Error ? error : new Error("Unknown error"),
        })
      ),
      TE.chain(wpPosts =>
        pipe(
          mapWordPressPostsToDomain(wpPosts),
          TE.fromEither,
          TE.mapLeft(
            (error): AppError => ({
              _tag: "ValidationError",
              field: "posts",
              message: error.message,
            })
          )
        )
      )
    );
  },

  /**
   * スラッグで投稿を取得
   */
  findBySlug: (slug: string): TE.TaskEither<AppError, Post> => {
    return pipe(
      TE.tryCatch(
        async () => {
          const baseUrl = serverEnv.WORDPRESS_URL || "";
          const result = await getWordPressPostBySlug(baseUrl, slug);

          if (E.isLeft(result)) {
            if (result.left.status === 404) {
              throw new Error(`Post not found: ${slug}`);
            }
            throw new Error(`Failed to fetch post: ${result.left.message}`);
          }

          return result.right;
        },
        (error): AppError => ({
          _tag: "NetworkError",
          error: error instanceof Error ? error : new Error("Unknown error"),
        })
      ),
      TE.chain(wpPost =>
        pipe(
          mapWordPressPostToDomain(wpPost),
          TE.fromEither,
          TE.mapLeft(
            (error): AppError => ({
              _tag: "ValidationError",
              field: "post",
              message: error.message,
            })
          )
        )
      )
    );
  },

  /**
   * タグスラッグで投稿を取得
   */
  findByTagSlug: (tagSlug: string): TE.TaskEither<AppError, Post[]> => {
    return pipe(
      wpApiPostRepository.findAll(),
      TE.map(posts =>
        posts.filter(post => post.tags.some(tag => tag.slug.value === tagSlug))
      )
    );
  },

  /**
   * タグIDで投稿を取得
   */
  findByTagId: (tagId: number): TE.TaskEither<AppError, Post[]> => {
    return pipe(
      TE.tryCatch(
        async () => {
          const baseUrl = serverEnv.WORDPRESS_URL || "";
          const result = await getWordPressPostsByTagId(baseUrl, tagId);

          if (E.isLeft(result)) {
            throw new Error(
              `Failed to fetch posts by tagId: ${result.left.message}`
            );
          }

          return result.right;
        },
        (error): AppError => ({
          _tag: "NetworkError",
          error: error instanceof Error ? error : new Error("Unknown error"),
        })
      ),
      TE.chain(wpPosts =>
        pipe(
          mapWordPressPostsToDomain(wpPosts),
          TE.fromEither,
          TE.mapLeft(
            (error): AppError => ({
              _tag: "ValidationError",
              field: "posts",
              message: error.message,
            })
          )
        )
      )
    );
  },

  /**
   * キーワードで投稿を検索
   */
  search: (query: string): TE.TaskEither<AppError, Post[]> => {
    return pipe(
      wpApiPostRepository.findAll(),
      TE.map(posts =>
        posts.filter(
          post =>
            post.title.value.toLowerCase().includes(query.toLowerCase()) ||
            post.content.toLowerCase().includes(query.toLowerCase()) ||
            post.excerpt.value.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  },
};
