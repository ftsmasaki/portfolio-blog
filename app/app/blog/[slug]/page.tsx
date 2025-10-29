import { getPosts, getPostBySlug } from "@/application/di/usecases";
import { extractRelatedPosts } from "@/application/services";
import { PostCard } from "@/presentation/components/blog/post-card";
import { PostHeader } from "@/presentation/components/blog/post-header";
import { EnhancedCodeBlock } from "@/presentation/components/blog/enhanced-code-block";
import type { Post } from "@/domain/blog/entities";
import Link from "next/link";
import { formatDate } from "@/presentation/utils/format";
import { TAG_ROUTES } from "@/shared/constants/routes";
import { notFound } from "next/navigation";
import { debugDomainEntity } from "@/infrastructure/utils/debug";
import { htmlToReactElement } from "@/infrastructure/utils/html-to-react";
import * as React from "react";

// ISR設定: 1時間ごとに再生成
export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * ビルド時に全ての記事のスラッグをプリフェッチ
 * generateStaticParamsで各記事ページを静的生成
 */
export async function generateStaticParams() {
  const postsResult = await getPosts()();

  if (postsResult._tag === "Left") {
    // エラー時は空配列を返して動的生成にフォールバック
    return [];
  }

  const posts = postsResult.right;
  return posts.map(post => ({
    slug: post.slug.value,
  }));
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
      {/* アイキャッチ画像、タイトル、日時、要約（Shared Element Transition用） */}
      <PostHeader post={post} />

      {/* メタ情報（タグ） */}
      <div className="mb-6">
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
