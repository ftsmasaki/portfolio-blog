import { getPosts, getPostBySlug } from "@/application/di/usecases";
import { extractRelatedPosts } from "@/application/services";
import { PostCard } from "@/presentation/components/blog/post-card";
import { EnhancedCodeBlock } from "@/presentation/components/blog/enhanced-code-block";
import type { Post } from "@/domain/blog/entities";
import Link from "next/link";
import { formatDate } from "@/presentation/utils/format";
import { TAG_ROUTES } from "@/shared/constants/routes";
import Image from "next/image";
import { notFound } from "next/navigation";
import { debugDomainEntity } from "@/infrastructure/utils/debug";
import { htmlToReactElement } from "@/infrastructure/utils/html-to-react";
import * as React from "react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const result = await getPostBySlug(slug)();

  if (result._tag === "Left") {
    return {
      title: "記事が見つかりません",
    };
  }

  const post = result.right;

  return {
    title: post.title.value,
    description: post.excerpt.value,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  // 記事取得
  const result = await getPostBySlug(slug)();

  if (result._tag === "Left") {
    notFound();
  }

  const post: Post = result.right;

  // デバッグ出力: 記事詳細データ
  debugDomainEntity(`Post Detail (slug: ${slug})`, {
    id: post.id.value,
    title: post.title.value,
    slug: post.slug.value,
    excerpt: post.excerpt.value,
    contentLength: post.content.length,
    createdAt: post.createdAt.value.toISOString(),
    updatedAt: post.updatedAt.value.toISOString(),
    featuredImage: post.featuredImage?.value,
    tags: post.tags.map(tag => ({
      id: tag.id.value,
      name: tag.name.value,
      slug: tag.slug.value,
      count: tag.count.value,
    })),
  });

  // HTMLをReactElementに変換（コードブロックのシンタックスハイライトを含む）
  // 副作用を持つコンポーネントはここで注入し、純粋関数から分離
  const contentElement = await htmlToReactElement(post.content, {
    pre: (props: any) => {
      const dataLanguage = props["data-language"];
      // rehype-pretty-codeで処理されたコードブロックの場合
      if (dataLanguage) {
        return React.createElement(EnhancedCodeBlock, {
          ...props,
          "data-language": dataLanguage,
        });
      }
      // 通常のpre要素の場合
      return React.createElement("pre", props);
    },
  });

  // 関連記事取得（全記事を取得して抽出）
  const allPostsResult = await getPosts()();
  const relatedPosts =
    allPostsResult._tag === "Right"
      ? extractRelatedPosts(post, allPostsResult.right, 5)
      : [];

  return (
    <article className="container mx-auto px-4 py-8">
      {/* アイキャッチ画像 */}
      {post.featuredImage && (
        <div className="relative w-full h-[400px] mb-8 overflow-hidden rounded-lg">
          <Image
            src={post.featuredImage.value}
            alt={post.title.value}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* メタ情報 */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-4">{post.title.value}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
          <time dateTime={post.createdAt.value.toISOString()}>
            投稿日: {formatDate(post.createdAt.value)}
          </time>
          {post.updatedAt.value.getTime() !==
            post.createdAt.value.getTime() && (
            <time dateTime={post.updatedAt.value.toISOString()}>
              更新日: {formatDate(post.updatedAt.value)}
            </time>
          )}
        </div>

        {/* タグ */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Link
                key={tag.id.value}
                href={TAG_ROUTES.DETAIL(tag.slug.value)}
                className="px-3 py-1 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors text-sm"
              >
                {tag.name.value}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 抜粋 */}
      {post.excerpt.value && (
        <div className="mb-8 p-4 bg-muted rounded-lg">
          <p className="text-lg">{post.excerpt.value}</p>
        </div>
      )}

      {/* 本文 */}
      <div className="max-w-none mb-8">{contentElement}</div>

      {/* 関連記事 */}
      {relatedPosts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">関連記事</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map(relatedPost => (
              <PostCard key={relatedPost.id.value} post={relatedPost} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
