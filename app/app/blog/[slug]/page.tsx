import { getPosts, getPostBySlug } from "@/application/di/usecases";
import { extractRelatedPosts } from "@/application/services";
import { PostCard } from "@/presentation/components/blog/post-card";
import { PostHeader } from "@/presentation/components/blog/post-header";
import { EnhancedCodeBlock } from "@/presentation/components/blog/enhanced-code-block";
import type { Post } from "@/domain/blog/entities";
import { notFound } from "next/navigation";
import { debugDomainEntity } from "@/infrastructure/utils/debug";
import { htmlToReactElement } from "@/infrastructure/utils/html-to-react";
import { buildHtmlAndToc } from "@/infrastructure/utils/extract-toc";
import { Toc } from "@/presentation/components/common/toc";
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

  // 見出しID付与＆TOC抽出 → ReactElement化（コードハイライト含む）
  const { html: contentWithIds, toc } = await buildHtmlAndToc(post.content, {
    headings: ["h2", "h3", "h4"],
  });

  const contentElement = await htmlToReactElement(contentWithIds, {
    pre: (
      props: React.ComponentProps<"pre"> & { "data-language"?: string }
    ) => {
      const dataLanguage = props["data-language"];
      // rehype-pretty-codeで処理されたコードブロックの場合
      if (dataLanguage) {
        const { children, className } = props;
        return (
          <EnhancedCodeBlock data-language={dataLanguage} className={className}>
            {children as React.ReactNode}
          </EnhancedCodeBlock>
        );
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-10">
        {/* 左カラム: 記事本体 */}
        <article className="min-w-0">
          {/* アイキャッチ画像、タイトル、日時、要約（Shared Element Transition用） */}
          <PostHeader post={post} />

          {/* 本文 */}
          <div className="prose prose-lg w-full lg:max-w-[740px] max-w-none">
            {contentElement}
          </div>

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

        {/* 右カラム: TOC */}
        <aside className="hidden lg:block w-[280px]">
          <Toc entries={toc} />
        </aside>
      </div>
    </div>
  );
}
