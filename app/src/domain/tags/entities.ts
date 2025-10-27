import type { TagId, TagName, TagSlug, TagCount } from "../value-objects";

/**
 * タグエンティティ
 */
export interface Tag {
  readonly id: TagId;
  readonly name: TagName;
  readonly slug: TagSlug;
  readonly count: TagCount;
}
