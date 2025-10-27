import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import type { Tag } from "@/domain/tags/entities";
import type { WordPressTag } from "@/infrastructure/external/types";
import {
  createTagId,
  createTagName,
  createTagSlug,
  createTagCount,
} from "@/domain/value-objects/tag";

/**
 * WordPressタグをドメインのTagエンティティに変換
 * @param wpTag - WordPress APIレスポンス
 * @returns Either<Error, Tag>
 */
export const mapWordPressTagToDomain = (
  wpTag: WordPressTag
): E.Either<Error, Tag> => {
  return pipe(
    E.Do,
    E.bind("id", () =>
      pipe(
        createTagId(wpTag.id),
        E.mapLeft(e => new Error(e))
      )
    ),
    E.bind("name", () =>
      pipe(
        createTagName(wpTag.name),
        E.mapLeft(e => new Error(e))
      )
    ),
    E.bind("slug", () =>
      pipe(
        createTagSlug(wpTag.slug),
        E.mapLeft(e => new Error(e))
      )
    ),
    E.bind("count", () =>
      pipe(
        createTagCount(wpTag.count),
        E.mapLeft(e => new Error(e))
      )
    ),
    E.map(({ id, name, slug, count }) => ({
      id,
      name,
      slug,
      count,
    }))
  );
};

/**
 * WordPressタグの配列をドメインのTagエンティティの配列に変換
 * @param wpTags - WordPress APIレスポンスの配列
 * @returns Either<Error, Tag[]>
 */
export const mapWordPressTagsToDomain = (
  wpTags: WordPressTag[]
): E.Either<Error, Tag[]> => {
  const results = wpTags.map(mapWordPressTagToDomain);
  const rights = results.filter(E.isRight).map(r => r.right);

  if (rights.length === wpTags.length) {
    return E.right(rights);
  }

  const left = results.find(E.isLeft);
  return left ? left : E.left(new Error("Unknown error"));
};
