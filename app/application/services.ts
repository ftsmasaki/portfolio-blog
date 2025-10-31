import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import type { Post } from "@/domain/blog/entities";

/**
 * 記事の関連記事を抽出する
 * - 同じタグを持つ記事を最大5件まで抽出
 *
 * @param targetPost - 対象の記事
 * @param allPosts - 全ての記事
 * @param maxCount - 最大取得件数（デフォルト: 5）
 * @returns 関連記事の配列
 */
export const extractRelatedPosts = (
  targetPost: Post,
  allPosts: Post[],
  maxCount: number = 5
): Post[] => {
  return pipe(
    allPosts,
    A.filter(post => post.id !== targetPost.id),
    A.filter(post => {
      const targetTags = targetPost.tags.map(t => t.id);
      const postTags = post.tags.map(t => t.id);
      return targetTags.some(tag => postTags.includes(tag));
    }),
    A.takeLeft(maxCount)
  );
};

