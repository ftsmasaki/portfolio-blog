import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import type { Work } from "@/domain/works/entities";
import type { WordPressPost } from "@/infrastructure/external/types";
import {
  createWorkId,
  createWorkTitle,
  createWorkSlug,
  createWorkDescription,
} from "@/domain/value-objects/work";
import { createPostDate } from "@/domain/value-objects/post";
import { createImageUrl } from "@/domain/value-objects/common";

/**
 * WordPress実績をドメインのWorkエンティティに変換
 * @param wpPost - WordPress APIレスポンス
 * @returns Either<Error, Work>
 */
export const mapWordPressWorkToDomain = (
  wpPost: WordPressPost
): E.Either<Error, Work> => {
  return pipe(
    E.Do,
    E.bind("id", () =>
      pipe(
        createWorkId(wpPost.id),
        E.mapLeft(e => new Error(e))
      )
    ),
    E.bind("title", () =>
      pipe(
        createWorkTitle(wpPost.title.rendered.replace(/<[^>]+>/g, "").trim()),
        E.mapLeft(e => new Error(e))
      )
    ),
    E.bind("slug", () =>
      pipe(
        createWorkSlug(wpPost.slug),
        E.mapLeft(e => new Error(e))
      )
    ),
    E.bind("description", () =>
      pipe(
        createWorkDescription(
          wpPost.excerpt.rendered.replace(/<[^>]+>/g, "").trim()
        ),
        E.mapLeft(e => new Error(e))
      )
    ),
    E.bind("createdAt", () =>
      pipe(
        createPostDate(wpPost.date),
        E.mapLeft(e => new Error(e))
      )
    ),
    E.bind("updatedAt", () =>
      pipe(
        createPostDate(wpPost.modified),
        E.mapLeft(e => new Error(e))
      )
    ),
    E.map(({ id, title, slug, description, createdAt, updatedAt }) => {
      // アイキャッチ画像のマッピング
      const featuredImage =
        wpPost._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

      // 実績の画像配列（現在はアイキャッチ画像のみ）
      const images = featuredImage
        ? (() => {
            const imageResult = createImageUrl(featuredImage);
            return E.isRight(imageResult) ? [imageResult.right] : [];
          })()
        : [];

      return {
        id,
        title,
        slug,
        description,
        technologies: [], // カスタムフィールドから取得予定
        githubUrl: undefined, // カスタムフィールドから取得予定
        liveUrl: undefined, // カスタムフィールドから取得予定
        images,
        createdAt,
        updatedAt,
      };
    })
  );
};

/**
 * WordPress実績の配列をドメインのWorkエンティティの配列に変換
 * @param wpPosts - WordPress APIレスポンスの配列
 * @returns Either<Error, Work[]>
 */
export const mapWordPressWorksToDomain = (
  wpPosts: WordPressPost[]
): E.Either<Error, Work[]> => {
  const results = wpPosts.map(mapWordPressWorkToDomain);
  const rights = results.filter(E.isRight).map(r => r.right);

  if (rights.length === wpPosts.length) {
    return E.right(rights);
  }

  const left = results.find(E.isLeft);
  return left ? left : E.left(new Error("Unknown error"));
};
