# フェーズ9: 最適化とSEO実装

## 概要
サイトのパフォーマンス最適化、画像最適化、コード分割、SEOメタタグと構造化データ、サイトマップの実装。

## サブフェーズ構成
- **フェーズ9.1**: 画像最適化とコード分割の実装
- **フェーズ9.2**: React Queryキャッシュ戦略の実装
- **フェーズ9.3**: SEOメタタグと構造化データの実装
- **フェーズ9.4**: サイトマップとrobots.txtの実装

---

## フェーズ9.1: 画像最適化とコード分割の実装

### 目的
サイトのパフォーマンス最適化

### 実装内容
- 画像最適化の実装
- コード分割の実装
- パフォーマンス監視の実装

### 完了条件
- [ ] 画像が最適化済み
- [ ] コード分割が実装済み
- [ ] パフォーマンスが最適化済み
- [ ] 型チェックエラーが0件

---

## フェーズ9.2: React Queryキャッシュ戦略の実装

### 目的
React Queryキャッシュ戦略の実装

### 実装内容
- キャッシュ戦略の最適化
- キャッシュ期限の設定
- リフェッチ戦略の設定

### 完了条件
- [ ] React Queryキャッシュが適切に動作
- [ ] キャッシュ戦略が最適化済み
- [ ] 型チェックエラーが0件

---

## フェーズ9.3: SEOメタタグと構造化データの実装

### 目的
SEOメタタグと構造化データの実装

### 実装内容
- メタタグの最適化
- 構造化データの実装
- Open Graphタグの実装
- Twitter Cardタグの実装

### 主要ファイル

**SEOユーティリティ (`presentation/utils/seo.ts`)**
```typescript
import type { Metadata } from 'next';
import type { Post } from '@/domain/blog/entities';
import type { Work } from '@/domain/works/entities';
import { BLOG_ROUTES, WORK_ROUTES } from '@/shared/constants/routes';

/**
 * 記事用のSEOメタデータを生成
 */
export const generatePostMetadata = (post: Post): Metadata => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: post.featuredImage 
        ? [{ url: `${siteUrl}${post.featuredImage}` }]
        : [],
      siteName: 'Portfolio Blog',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: BLOG_ROUTES.POST(post.slug),
    },
  };
};

/**
 * 構造化データ（JSON-LD）を生成
 */
export const generateArticleStructuredData = (post: Post) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage ? `${siteUrl}${post.featuredImage}` : undefined,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
  };
};
```

### 完了条件
- [ ] メタタグが最適化済み
- [ ] 構造化データが実装済み
- [ ] Open Graphタグが実装済み
- [ ] Twitter Cardタグが実装済み
- [ ] 型チェックエラーが0件

---

## フェーズ9.4: サイトマップとrobots.txtの実装

### 目的
サイトマップとrobots.txtの実装

### 実装内容
- サイトマップの生成
- robots.txtの設定

### 主要ファイル

**サイトマップ生成 (`app/sitemap.ts`)**
```typescript
import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/application/di/usecases';
import { BLOG_ROUTES, WORK_ROUTES, COMMON_ROUTES } from '@/shared/constants/routes';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  
  // 基本ページ
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}${BLOG_ROUTES.INDEX}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}${WORK_ROUTES.INDEX}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
  
  // 記事ページ
  const posts = await getAllPosts()();
  if (posts._tag === 'right') {
    const postRoutes: MetadataRoute.Sitemap = posts.right.map((post) => ({
      url: `${baseUrl}${BLOG_ROUTES.POST(post.slug)}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
    routes.push(...postRoutes);
  }
  
  return routes;
}
```

**robots.txt生成 (`app/robots.ts`)**
```typescript
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

### 完了条件
- [ ] サイトマップが生成済み
- [ ] robots.txtが設定済み
- [ ] 型チェックエラーが0件

---

## フェーズ9全体の完了条件

### 技術指標
- [ ] 型チェックエラーが0件
- [ ] 全ての機能が実装済み

### 機能指標
- [ ] 画像が最適化済み
- [ ] React Queryキャッシュが適切に動作
- [ ] SEOが最適化されている
- [ ] サイトマップが生成済み

### 次のフェーズ
**フェーズ10: アナリティクスと監視実装** に進む

