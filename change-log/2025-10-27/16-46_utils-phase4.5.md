# フェーズ4.5: ユーティリティ関数の実装完了

## 何を (What)

### 実装した機能
- SEO関連ユーティリティの実装（seo.ts）
- format関数（日付フォーマット）- 既存確認済み
- cn関数（クラス名ユーティリティ）- 既存確認済み

### 変更されたファイル
- `app/src/presentation/utils/seo.ts` (新規作成)
- `app/src/presentation/utils/cn.ts` (既存・確認)
- `app/src/presentation/utils/format.ts` (既存・確認)

## どんな目的で (Why)

### 変更を行った理由
- SEO最適化のためのメタデータ生成
- 構造化データの生成による検索エンジン対策
- コードの再利用性向上

### 解決したい課題
- SEO最適化の一元管理
- 構造化データによる検索エンジン対策
- パンくずリストの実装

## どう変更したか (How)

### 具体的な実装方法

#### SEO関連ユーティリティ（seo.ts）
```typescript
import type { Metadata } from "next";

/**
 * ページのメタデータを生成する関数
 */
export const generateMetadata = (
  title: string,
  description: string,
  path?: string
): Metadata => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const url = path ? `${siteUrl}${path}` : siteUrl;
  const titleTemplate = path ? `${title} | ${process.env.NEXT_PUBLIC_SITE_NAME}` : title;

  return {
    title: titleTemplate,
    description,
    openGraph: {
      title: titleTemplate,
      description,
      url,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Portfolio Blog",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titleTemplate,
      description,
    },
  };
};

/**
 * JSON-LD構造化データを生成する関数
 */
export const generateStructuredData = (
  type: string,
  data: Record<string, unknown>
): string => {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  });
};

/**
 * ブログ記事用の構造化データを生成する関数
 */
export const generateArticleStructuredData = (
  title: string,
  description: string,
  publishedDate: string,
  modifiedDate: string,
  author: string,
  image?: string
): string => {
  return generateStructuredData("Article", {
    headline: title,
    description,
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: process.env.NEXT_PUBLIC_SITE_NAME || "Portfolio Blog",
    },
    ...(image && { image }),
  });
};

/**
 * パンくずリストの構造化データを生成する関数
 */
export const generateBreadcrumbStructuredData = (
  items: Array<{ name: string; path: string }>
): string => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  
  return generateStructuredData("BreadcrumbList", {
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  });
};
```

### 使用した技術
- Next.js Metadata API
- JSON-LD構造化データ
- Open Graph、Twitter Card
- clsx、tailwind-merge
- date-fns

### 重要なコードの変更点
1. **SEO最適化**: メタデータ、Open Graph、Twitter Card対応
2. **構造化データ**: JSON-LDによる検索エンジン対策
3. **ブログ記事対応**: Articleタイプの構造化データ
4. **パンくずリスト**: BreadcrumbListの構造化データ
5. **フォーマット関数**: 日付フォーマット、相対日付、ISO解析

## 考えられる影響と範囲

### 既存機能への影響
- SEO関連の機能が拡充
- 構造化データによる検索エンジン対策が強化

### ユーザーエクスペリエンスへの影響
- SNSシェア時の表示品質向上
- 検索エンジンでの表示改善

### パフォーマンスへの影響
- 軽量な実装により影響は最小限
- メタデータ生成の最適化

## 課題

### 今後の改善点
- 画像の最適化対応
- 多言語対応の検討
- 動的なOG画像生成

### 未解決の問題
- なし（フェーズ4.5の要件は全て満たしている）

### 追加で必要な作業
- フェーズ5: ブログ機能実装

## 完了条件の確認

### ✅ フェーズ4.5完了条件
- [x] format関数が実装済み（既存）
- [x] cn関数が実装済み（既存）
- [x] SEO関連ユーティリティが実装済み
- [x] 型チェックエラーが0件
- [x] リントエラーが0件

## フェーズ4全体の完了

### ✅ フェーズ4完了条件
- [x] UIコンポーネントが実装済み
- [x] カスタムフックが実装済み
- [x] Zustandストアが実装済み
- [x] ユーティリティ関数が実装済み
- [x] 型チェックエラーが0件

## 次のアクション

フェーズ5: ブログ機能実装に進む準備が整いました。

### 推奨コミットメッセージ
```
feat: [フェーズ4.5] SEO関連ユーティリティの実装

- メタデータ生成関数を実装
- 構造化データ生成関数を実装
- ブログ記事用の構造化データを実装
- パンくずリストの構造化データを実装
```
