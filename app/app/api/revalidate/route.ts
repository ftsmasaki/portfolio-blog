import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * WordPress On-Demand RevalidationプラグインからのWebhookを受信
 * 記事の追加・更新・削除時にNext.jsのキャッシュを無効化
 */
export async function POST(request: NextRequest) {
  // セキュリティトークンの検証
  const secret = request.headers.get("x-revalidate-secret");
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, path, tag } = body;

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
    } else if (type === "tag") {
      revalidatePath("/tags", "page");
      revalidatePath("/blog", "page");
      revalidateTag("tags", "");
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
