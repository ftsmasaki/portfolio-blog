import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/application/di/usecases";
import {
  OG_SIZE as size,
  OG_CONTENT_TYPE as contentType,
  loadNotoSansJpRegular,
  DEFAULT_BACKGROUND,
  buildFonts,
  getHostFromEnv,
} from "@/presentation/utils/og";

// size, contentType は共通ユーティリティから参照

export default async function OgImage({
  params,
}: {
  params: { slug: string };
}) {
  const fontData = await loadNotoSansJpRegular();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Portfolio Blog";
  const host = getHostFromEnv();

  const result = await getPostBySlug(params.slug)();
  if (result._tag === "Left") {
    // フォールバックの簡易OG
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#0b0b0f",
            color: "#fff",
          }}
        >
          <div style={{ fontSize: 48, opacity: 0.8 }}>{siteName}</div>
          <div style={{ fontSize: 80, fontWeight: 700, marginTop: 16 }}>
            Post
          </div>
        </div>
      ),
      {
        ...size,
        fonts: buildFonts(fontData),
      }
    );
  }

  const post = result.right;
  const title = post.title.value;
  const date = post.createdAt.value.toISOString().slice(0, 10);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: DEFAULT_BACKGROUND,
          color: "#eaeaea",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              background: "#60a5fa",
            }}
          />
          <div style={{ fontSize: 36, opacity: 0.9 }}>{siteName}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 64,
              lineHeight: 1.2,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 28, opacity: 0.8 }}>{date}</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            opacity: 0.6,
          }}
        >
          <div style={{ fontSize: 24 }}>blog/{post.slug.value}</div>
          <div style={{ fontSize: 24 }}>@{host}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: buildFonts(fontData),
    }
  );
}
