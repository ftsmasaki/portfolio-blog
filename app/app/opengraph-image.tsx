import { ImageResponse } from "next/og";
import {
  OG_SIZE as size,
  OG_CONTENT_TYPE as contentType,
  loadNotoSansJpRegular,
  DEFAULT_BACKGROUND,
  buildFonts,
  getHostFromEnv,
} from "@/presentation/utils/og";

export default async function OgImage() {
  const fontData = await loadNotoSansJpRegular();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Portfolio Blog";
  const host = getHostFromEnv();

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
          background: DEFAULT_BACKGROUND,
          color: "#ffffff",
          gap: 20,
        }}
      >
        <div style={{ fontSize: 56, opacity: 0.9 }}>{siteName}</div>
        <div style={{ fontSize: 96, fontWeight: 700 }}>Portfolio Blog</div>
        <div style={{ fontSize: 28, opacity: 0.7 }}>{host}</div>
      </div>
    ),
    {
      ...size,
      fonts: buildFonts(fontData),
    }
  );
}
