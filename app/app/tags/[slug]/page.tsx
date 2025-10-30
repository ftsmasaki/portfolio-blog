import { notFound } from "next/navigation";
import { getPostsByTag, getTagBySlug } from "@/application/di/usecases";
import type { Post } from "@/domain/blog/entities";
import type { Tag } from "@/domain/tags/entities";
import { PostList } from "@/presentation/components/blog/post-list";

export const revalidate = 3600;

interface PageProps {
  readonly params: { slug: string };
}

export default async function TagDetailPage({ params }: PageProps) {
  const tagResult = await getTagBySlug(params.slug)();
  if (tagResult._tag === "Left") {
    if (tagResult.left._tag === "NetworkError") {
      throw new Error(tagResult.left.error.message);
    }
    return notFound();
  }

  const tag: Tag = tagResult.right;

  const postsResult = await getPostsByTag(tag.slug.value)();
  if (postsResult._tag === "Left") {
    if (postsResult.left._tag === "NetworkError") {
      throw new Error(postsResult.left.error.message);
    }
    return notFound();
  }

  const posts: Post[] = postsResult.right;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{tag.name.value}</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {posts.length} 件の記事
      </p>

      <PostList posts={posts} postsPerPage={12} />
    </div>
  );
}


