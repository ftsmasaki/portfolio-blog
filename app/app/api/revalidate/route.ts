import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { serverEnv } from "@/config/env";

/**
 * WordPress On-Demand RevalidationプラグインからのWebhookを受信
 * 記事の追加・更新・削除時にNext.jsのキャッシュを無効化
 */
export async function POST(request: NextRequest) {
  // セキュリティトークンの検証
  const secret = request.headers.get("x-revalidate-secret");
  const expectedSecret = serverEnv.REVALIDATE_SECRET;

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      type,
      path,
      tag,
      tagSlug,
      tagSlugs,
    }: {
      type?: string;
      path?: string;
      tag?: string;
      tagSlug?: string;
      tagSlugs?: string[];
    } = body;

    // パスベースのリアバリデーション
    if (path) {
      revalidatePath(path, "page");
      console.log(`Revalidated path: ${path}`);
    }

    // タグベースのリアバリデーション
    if (tag) {
      revalidateTag(tag, "");
      console.log(`Revalidated tag: ${tag}`);
    }

    // 型に応じたリアバリデーション
    if (type === "post") {
      revalidatePath("/blog", "page");
      revalidatePath("/blog/[slug]", "page");
      revalidatePath("/", "page");
      revalidateTag("posts", "");
      // 検索ドキュメントのキャッシュも同時に無効化
      revalidateTag("search-index", "");
      // 投稿に紐づくタグ詳細ページも再検証（任意で tagSlugs を渡す）
      if (Array.isArray(tagSlugs)) {
        for (const slug of tagSlugs) {
          if (typeof slug === "string" && slug.length > 0) {
            revalidatePath(`/tags/${slug}`, "page");
          }
        }
      }
    } else if (type === "tag") {
      revalidatePath("/tags", "page");
      revalidatePath("/blog", "page");
      revalidateTag("tags", "");
      // 単一のタグ詳細ページが更新された場合（tagSlug を渡す）
      if (typeof tagSlug === "string" && tagSlug.length > 0) {
        revalidatePath(`/tags/${tagSlug}`, "page");
      }
    }

    return NextResponse.json({
      revalidated: true,
      message: "Cache revalidated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      {
        error: "Error revalidating cache",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
