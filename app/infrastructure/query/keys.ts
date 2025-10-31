/**
 * React QueryのQuery Keys定義
 * 階層構造で定義し、キャッシュ管理を効率的に行う
 */
export const queryKeys = {
  /**
   * ブログ記事のQuery Keys
   */
  posts: {
    all: ["posts"] as const,
    lists: () => [...queryKeys.posts.all, "list"] as const,
    list: (filters: string) =>
      [...queryKeys.posts.lists(), { filters }] as const,
    details: () => [...queryKeys.posts.all, "detail"] as const,
    detail: (slug: string) => [...queryKeys.posts.details(), slug] as const,
    search: (query: string) =>
      [...queryKeys.posts.all, "search", query] as const,
    byTag: (tagSlug: string) =>
      [...queryKeys.posts.all, "tag", tagSlug] as const,
  },

  /**
   * タグのQuery Keys
   */
  tags: {
    all: ["tags"] as const,
    lists: () => [...queryKeys.tags.all, "list"] as const,
    details: () => [...queryKeys.tags.all, "detail"] as const,
    detail: (slug: string) => [...queryKeys.tags.details(), slug] as const,
  },
} as const;
