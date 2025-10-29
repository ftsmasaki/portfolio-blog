# フェーズ5: ブログ機能実装

## 概要
WordPress REST APIからのデータ取得とブログ記事の表示機能を実装。

## サブフェーズ構成
- **フェーズ5.1**: ブログAPIスキーマとバリデーション実装
- **フェーズ5.2**: ブログ記事一覧ページの実装
- **フェーズ5.3**: ブログ記事カードコンポーネントの実装
- **フェーズ5.4**: ブログ記事詳細ページの実装
- **フェーズ5.5**: Markdownレンダリング機能の実装
- **フェーズ5.6**: TOC機能の実装
- **フェーズ5.7**: 共有ボタン機能の実装
- **フェーズ5.8**: Shared Element Transitionの実装
- **フェーズ5.9**: タグ機能の実装
- **フェーズ5.10**: オンデマンドISR対応

---

## フェーズ5.1: ブログAPIスキーマとバリデーション

### 目的
WordPress APIレスポンスのバリデーション実装

### 実装内容
- Zodスキーマ定義
- バリデーション関数
- エラーハンドリング

### 完了条件
- [x] Zodスキーマが定義済み
- [x] バリデーション関数が実装済み
- [x] 型チェックエラーが0件

---

## フェーズ5.2: ブログ記事一覧ページの実装

### 目的
記事一覧ページの実装（3カラムレイアウト、ページネーション）

### 実装内容
- 記事一覧ページの実装
- ページネーション機能の実装
- タグ一覧の実装
- フィルタリング機能の実装

### 完了条件
- ✅ 記事一覧ページが正常に表示
- ✅ 3カラムレイアウトが実装済み
- ✅ ページネーションが動作
- ✅ タグ一覧が表示
- ✅ 型チェックエラーが0件

---

## フェーズ5.3: ブログ記事カードコンポーネントの実装

### 目的
記事カードコンポーネントの実装

### 実装内容
- 記事カードコンポーネントの実装
- Shared Element Transition準備

### 主要ファイル

**記事カード (`presentation/components/blog/post-card.tsx`)**
```typescript
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Post } from '@/domain/blog/entities';
import Link from 'next/link';
import { formatPostDate } from '@/presentation/utils/format';
import { BLOG_ROUTES } from '@/shared/constants/routes';

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <Link href={BLOG_ROUTES.POST(post.slug)} scroll={false}>
      <motion.article
        layoutId={`post-${post.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="h-full overflow-hidden cursor-pointer group">
          {post.featuredImage && (
            <div className="relative w-full h-48 overflow-hidden">
              <motion.img
                layoutId={`post-image-${post.id}`}
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <CardHeader>
            <motion.h3 
              layoutId={`post-title-${post.id}`}
              className="text-lg font-semibold line-clamp-2"
            >
              {post.title}
            </motion.h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <time dateTime={post.createdAt.toISOString()}>
                {formatPostDate(post.createdAt)}
              </time>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {post.excerpt}
            </p>
          </CardContent>
        </Card>
      </motion.article>
    </Link>
  );
};
```

### 完了条件
- ✅ 記事カードコンポーネントが実装済み
- ✅ 正常に表示
- ✅ 型チェックエラーが0件

---

## フェーズ5.4: ブログ記事詳細ページの実装

### 目的
記事詳細ページの実装

### 実装内容
- 記事詳細ページの実装
- 記事メタ情報の表示
- 関連記事機能の実装

### 完了条件
- ✅ 記事詳細ページが実装済み
- ✅ メタ情報が正常に表示
- ✅ 関連記事が表示
- ✅ 型チェックエラーが0件

---

## フェーズ5.5: Markdownレンダリング機能の実装

### 目的
Markdownで記述された記事本文のレンダリング機能の実装

### 実装内容
- remark/rehypeを使ったMarkdownレンダリング
- シンタックスハイライト
- 見出しの自動リンク

### 主要ファイル

**Markdownレンダリング (`infrastructure/utils/markdown.ts`)**
```typescript
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';
import rehype from 'rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export const processMarkdown = async (content: string): Promise<string> => {
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml)
    .process(content);

  const html = await rehype()
    .data('settings', { fragment: true })
    .use(rehypeHighlight)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: {
        className: ['heading-link'],
      },
    })
    .process(processed.toString());

  return html.toString();
};
```

### 完了条件
- [ ] Markdownレンダリングが実装済み
- [ ] シンタックスハイライトが動作
- [ ] 見出しの自動リンクが動作
- [ ] 型チェックエラーが0件

---

## フェーズ5.6: TOC機能の実装

### 目的
Zenn風の追従目次（Table of Contents）機能の実装

### 実装内容
- TOC生成機能
- 追従表示機能
- アクティブセクションのハイライト

### 主要ファイル

**TOC (`presentation/components/blog/toc.tsx`)**
```typescript
'use client';

import { useEffect, useState, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TocProps {
  items: TocItem[];
}

export const Toc = ({ items }: TocProps) => {
  const [activeId, setActiveId] = useState<string>('');
  const headersRef = useRef<Map<string, IntersectionObserverEntry>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id) {
            if (entry.isIntersecting) {
              headersRef.current.set(entry.target.id, entry);
            } else {
              headersRef.current.delete(entry.target.id);
            }
          }
        });

        const visible = Array.from(headersRef.current.values());
        if (visible.length > 0) {
          const topMost = visible.reduce((prev, current) =>
            current.boundingClientRect.top < prev.boundingClientRect.top
              ? current
              : prev
          );
          setActiveId(topMost.target.id);
        }
      },
      {
        rootMargin: '-100px 0px -80% 0px',
        threshold: 0,
      }
    );

    const headers = document.querySelectorAll('h2, h3, h4');
    headers.forEach((header) => observer.observe(header));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto" aria-label="目次">
      <h2 className="font-semibold text-sm mb-4">目次</h2>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => scrollToSection(item.id)}
              className={cn(
                'flex items-start gap-2 text-sm text-left w-full py-1 px-2 rounded-md',
                'hover:bg-accent hover:text-accent-foreground',
                activeId === item.id && 'bg-accent text-accent-foreground font-medium',
                item.level === 3 && 'ml-4',
                item.level === 4 && 'ml-8'
              )}
            >
              <ChevronRight className="h-4 w-4 mt-0.5 shrink-0" />
              <span className="line-clamp-2">{item.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
```

### 完了条件
- [ ] TOC機能が実装済み
- [ ] 追従表示が動作
- [ ] アクティブセクションがハイライト表示
- [ ] 型チェックエラーが0件

---

## フェーズ5.7: 共有ボタン機能の実装

### 目的
SNS共有機能の実装

### 実装内容
- Twitter共有機能
- Facebook共有機能
- クリップボードコピー機能

### 主要ファイル

**ShareButtons (`presentation/components/blog/share-buttons.tsx`)**
```typescript
import { Button } from '@/components/ui/button';
import { Share2, Twitter, Facebook, Copy } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export const ShareButtons = ({ url, title }: ShareButtonsProps) => {
  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
      '_blank'
    );
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      '_blank'
    );
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      // トースト通知など
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={shareToTwitter}>
        <Twitter className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={shareToFacebook}>
        <Facebook className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={copyToClipboard}>
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
};
```

### 完了条件
- [ ] 共有ボタンが実装済み
- [ ] 正常に動作
- [ ] 型チェックエラーが0件

---

## フェーズ5.8: Shared Element Transitionの実装

### 目的
framer-motionを使用したShared Element Transitionの実装

### 実装内容
- トランジションページラッパー
- 記事カードからのトランジション
- 記事詳細へのトランジション

### 主要ファイル

**トランジションページラッパー (`presentation/components/common/transition-page.tsx`)**
```typescript
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface TransitionPageProps {
  children: ReactNode;
}

export const TransitionPage = ({ children }: TransitionPageProps) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
```

### 完了条件
- [ ] トランジションが実装済み
- [ ] スムーズに動作
- [ ] 型チェックエラーが0件

---

## フェーズ5.9: タグ機能の実装

### 目的
タグ一覧とタグ詳細ページの実装

### 実装内容
- タグ一覧ページの実装
- タグ詳細ページの実装
- タグクラウド表示の実装

### 完了条件
- [ ] タグ一覧ページが実装済み
- [ ] タグ詳細ページが実装済み
- [ ] タグクラウドが表示
- [ ] 型チェックエラーが0件

---

## フェーズ5.10: オンデマンドISR対応

### 目的
ブログ記事ページでISR（Incremental Static Regeneration）を有効化し、WordPress管理画面での更新をリアルタイムで反映

### 実装内容
- ブログ記事一覧ページ（`/blog`）でのISR設定
- ブログ記事詳細ページ（`/blog/[slug]`）でのISR設定
- タグ一覧ページ（`/tags`）でのISR設定
- タグ詳細ページ（`/tags/[slug]`）でのISR設定
- ページネーション対応

### 主要ファイル

**ブログ記事一覧ページ (`app/blog/page.tsx`)**
```typescript
import { unstable_noStore as noStore } from 'next/cache';
import { PostList } from '@/presentation/components/blog/post-list';

// ISR設定
export const revalidate = 3600; // 1時間ごとに再生成
// export const dynamic = 'force-static'; // 静的生成を強制

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string; tag?: string };
}) {
  // キャッシュの動作確認用（本番では削除）
  // noStore();

  const currentPage = Number(searchParams.page) || 1;
  
  // データ取得処理
  // ...

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">ブログ</h1>
      <PostList posts={posts} currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
```

**ブログ記事詳細ページ (`app/blog/[slug]/page.tsx`)**
```typescript
import { PostDetail } from '@/presentation/components/blog/post-detail';

// ISR設定
export const revalidate = 3600;

export async function generateStaticParams() {
  // ビルド時に全ての記事のスラッグをプリフェッチ
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PostDetail post={post} />
    </div>
  );
}
```

**タグ一覧ページ (`app/tags/page.tsx`)**
```typescript
import { TagList } from '@/presentation/components/tags/tag-list';

// ISR設定
export const revalidate = 7200; // 2時間ごとに再生成

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">タグ一覧</h1>
      <TagList tags={tags} />
    </div>
  );
}
```

### On-Demand Revalidation APIとの連携

フェーズ2.7で実装した `/api/revalidate` エンドポイントが、以下の場合にブログページを再生成します：
- `type: 'post'` が送信された場合: `/blog`, `/blog/[slug]`, `/` が再生成
- `type: 'tag'` が送信された場合: `/tags`, `/blog` が再生成

### 完了条件
- ✅ ブログ記事一覧ページでISRが有効化
- ✅ ブログ記事詳細ページでISRが有効化
- ✅ タグ一覧ページでISRが有効化
- ✅ タグ詳細ページでISRが有効化
- ✅ generateStaticParamsが実装済み（詳細ページのみ）
- ✅ WordPress更新時に自動再生成される
- ✅ 型チェックエラーが0件

---

## フェーズ5全体の完了条件

### 技術指標
- [ ] 型チェックエラーが0件
- [ ] 全てのページが実装済み
- [ ] ISRが適切に設定済み

### 機能指標
- [ ] 記事一覧が正常に表示
- [ ] 記事詳細が正常に表示
- [ ] TOCが正常に動作
- [ ] 共有機能が正常に動作
- [ ] トランジションが正常に動作
- [ ] タグ機能が正常に動作
- [ ] WordPress更新時に自動再生成される

### 次のフェーズ
**フェーズ6: 検索機能実装** に進む

