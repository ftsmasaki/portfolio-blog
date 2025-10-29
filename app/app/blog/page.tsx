import { getPosts, getTags } from "@/application/di/usecases";
import { PostList } from "@/presentation/components/blog/post-list";
import type { Post } from "@/domain/blog/entities";
import type { Tag } from "@/domain/tags/entities";
import Link from "next/link";
import { TAG_ROUTES } from "@/shared/constants/routes";
import { debugDomainEntity } from "@/infrastructure/utils/debug";

// ISR設定: 1時間ごとに再生成
export const revalidate = 3600;

export const metadata = {
  title: "ブログ",
  description: "ブログ記事一覧",
};

export default async function BlogPage() {
  // ビルド時にデータ取得
  const postsResult = await getPosts()();
  const tagsResult = await getTags()();

  if (postsResult._tag === "Left") {
    const errorMsg =
      postsResult.left._tag === "NetworkError"
        ? postsResult.left.error.message
        : postsResult.left._tag === "ValidationError"
        ? postsResult.left.message
        : "Unknown error";
    throw new Error(errorMsg);
  }

  const posts: Post[] = postsResult.right;
  const tags: Tag[] = tagsResult._tag === "Right" ? tagsResult.right : [];

  // デバッグ出力: 記事一覧データ
  debugDomainEntity("Post List", {
    totalPosts: posts.length,
    posts: posts.map(post => ({
      id: post.id.value,
      title: post.title.value,
      slug: post.slug.value,
      excerpt: post.excerpt.value,
      contentLength: post.content.length,
      createdAt: post.createdAt.value.toISOString(),
      featuredImage: post.featuredImage?.value,
      tags: post.tags.map(tag => ({
        id: tag.id.value,
        name: tag.name.value,
        slug: tag.slug.value,
      })),
    })),
  });

  // デバッグ出力: タグ一覧データ
  debugDomainEntity("Tag List", {
    totalTags: tags.length,
    tags: tags.map(tag => ({
      id: tag.id.value,
      name: tag.name.value,
      slug: tag.slug.value,
      count: tag.count.value,
    })),
  });

  // よく使われるタグを取得（使用回数でソート、上位10件）
  const popularTags = [...tags]
    .sort((a, b) => b.count.value - a.count.value)
    .slice(0, 10);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ブログ</h1>

      {/* タグ一覧 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">タグ</h2>
        <div className="flex flex-wrap gap-2">
          {popularTags.length > 0 ? (
            popularTags.map(tag => (
              <Link
                key={tag.id.value}
                href={TAG_ROUTES.DETAIL(tag.slug.value)}
                className="px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors text-sm"
              >
                {tag.name.value}
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">タグがありません</p>
          )}
        </div>
      </div>

      {/* 記事一覧とページネーション */}
      <PostList posts={posts} postsPerPage={12} />
    </div>
  );
}
