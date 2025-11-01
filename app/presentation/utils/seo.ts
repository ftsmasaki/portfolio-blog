import type { Metadata } from "next";
import { publicEnv } from "@/config/env";

/**
 * ページのメタデータを生成する関数
 * @param title - ページタイトル
 * @param description - ページの説明
 * @param path - ページのパス（オプション）
 * @returns メタデータオブジェクト
 */
export const generateMetadata = (
  title: string,
  description: string,
  path?: string
): Metadata => {
  const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL;
  const url = path ? `${siteUrl}${path}` : siteUrl;
  const titleTemplate = path
    ? `${title} | ${publicEnv.NEXT_PUBLIC_SITE_NAME}`
    : title;

  return {
    title: titleTemplate,
    description,
    openGraph: {
      title: titleTemplate,
      description,
      url,
      siteName: publicEnv.NEXT_PUBLIC_SITE_NAME,
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
 * @param type - 構造化データのタイプ
 * @param data - 構造化データの内容
 * @returns JSON-LD文字列
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
 * @param title - 記事のタイトル
 * @param description - 記事の説明
 * @param publishedDate - 公開日
 * @param modifiedDate - 更新日
 * @param author - 著者名
 * @param image - 画像URL（オプション）
 * @returns ブログ記事のJSON-LD文字列
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
      name: publicEnv.NEXT_PUBLIC_SITE_NAME,
    },
    ...(image && { image }),
  });
};

/**
 * パンくずリストの構造化データを生成する関数
 * @param items - パンくずリストの項目
 * @returns パンくずリストのJSON-LD文字列
 */
export const generateBreadcrumbStructuredData = (
  items: Array<{ name: string; path: string }>
): string => {
  const siteUrl = publicEnv.NEXT_PUBLIC_SITE_URL;

  return generateStructuredData("BreadcrumbList", {
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  });
};
