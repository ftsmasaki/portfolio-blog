import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import type { Post } from "@/domain/blog/entities";
import type { WordPressPost } from "@/infrastructure/external/types";
import {
  createPostId,
  createPostTitle,
  createPostSlug,
  createPostExcerpt,
  createPostDate,
} from "@/domain/value-objects/post";
import {
  createTagId,
  createTagName,
  createTagSlug,
  createTagCount,
} from "@/domain/value-objects/tag";
import { createImageUrl } from "@/domain/value-objects/common";

/**
 * WordPress記事をドメインのPostエンティティに変換
 * @param wpPost - WordPress APIレスポンス
 * @returns Either<Error, Post>
 */
export const mapWordPressPostToDomain = (
  wpPost: WordPressPost
): E.Either<Error, Post> => {
  return pipe(
    E.Do,
    E.bind("id", () =>
      pipe(
        createPostId(wpPost.id),
        E.mapLeft(e => new Error(e))
      )
    ),
    E.bind("title", () =>
      pipe(
        createPostTitle(wpPost.title.rendered.replace(/<[^>]+>/g, "").trim()),
        E.mapLeft(e => new Error(e))
      )
    ),
    E.bind("slug", () =>
      pipe(
        createPostSlug(wpPost.slug),
        E.mapLeft(e => new Error(e))
      )
    ),
    E.bind("excerpt", () =>
      pipe(
        createPostExcerpt(
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
    E.map(({ id, title, slug, excerpt, createdAt, updatedAt }) => {
      // タグのマッピング（wp:term はタクソノミーごとの配列配列。全配列をflattenしてpost_tagのみ抽出）
      const termGroups = (wpPost._embedded?.["wp:term"] ?? []) as Array<any[]>;
      const wpTerms = termGroups
        .flat()
        .filter(term => term && term.taxonomy === "post_tag");

      const tags = wpTerms
        .map(term => {
          const idResult = createTagId(term.id);
          const nameResult = createTagName(term.name);
          const slugResult = createTagSlug(term.slug);

          if (
            E.isRight(idResult) &&
            E.isRight(nameResult) &&
            E.isRight(slugResult)
          ) {
            return {
              id: idResult.right,
              name: nameResult.right,
              slug: slugResult.right,
              count: { _tag: "TagCount" as const, value: term.count || 0 },
            };
          }
          return null;
        })
        .filter((tag): tag is NonNullable<typeof tag> => tag !== null);

      // アイキャッチ画像のマッピング
      const featuredImage =
        wpPost._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
      const imageResult = featuredImage
        ? createImageUrl(featuredImage)
        : E.right<Error, undefined>(undefined);

      return {
        id,
        title,
        slug,
        excerpt,
        content: wpPost.content.rendered,
        createdAt,
        updatedAt,
        featuredImage: E.isRight(imageResult) ? imageResult.right : undefined,
        tags,
      };
    })
  );
};

/**
 * WordPress記事の配列をドメインのPostエンティティの配列に変換
 * @param wpPosts - WordPress APIレスポンスの配列
 * @returns Either<Error, Post[]>
 */
export const mapWordPressPostsToDomain = (
  wpPosts: WordPressPost[]
): E.Either<Error, Post[]> => {
  const results = wpPosts.map(mapWordPressPostToDomain);
  const rights = results.filter(E.isRight).map(r => r.right);

  if (rights.length === wpPosts.length) {
    return E.right(rights);
  }

  const left = results.find(E.isLeft);
  return left ? left : E.left(new Error("Unknown error"));
};
