export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;

export const DEFAULT_BACKGROUND =
  "linear-gradient(135deg, #0b0b0f 0%, #13131a 60%, #1e1e28 100%)";

/**
 * Noto Sans JP Regular のフォントデータを ArrayBuffer で取得する。
 * 失敗時は空の ArrayBuffer を返す（ImageResponse は描画継続可能）。
 */
export async function loadNotoSansJpRegular(): Promise<ArrayBuffer> {
  try {
    // Google Fonts の静的配信URL（サブセット互換）。配信失敗時はフォールバック
    const url =
      "https://fonts.gstatic.com/s/notosansjp/v52/-F6ofjtqLzI2JPCgQBnw7HFQogg.ttf";
    const res = await fetch(url);
    return await res.arrayBuffer();
  } catch {
    return new ArrayBuffer(0);
  }
}

export function buildFonts(fontData: ArrayBuffer) {
  return [
    {
      name: "Noto Sans JP" as const,
      data: fontData,
      style: "normal" as const,
      weight: 400 as const,
    },
  ];
}

export function getHostFromEnv(): string {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://example.com")
    .host;
}
