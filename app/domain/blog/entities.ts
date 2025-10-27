import type {
  PostId,
  PostTitle,
  PostSlug,
  PostExcerpt,
  PostDate,
  ImageUrl,
} from "@/domain/value-objects";
import type { Tag } from "@/domain/tags/entities";

/**
 * ブログエンティティ
 */
export interface Post {
  readonly id: PostId;
  readonly title: PostTitle;
  readonly slug: PostSlug;
  readonly excerpt: PostExcerpt;
  readonly content: string;
  readonly createdAt: PostDate;
  readonly updatedAt: PostDate;
  readonly featuredImage?: ImageUrl;
  readonly tags: Tag[];
}
