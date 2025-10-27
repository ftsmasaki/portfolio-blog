import { z } from "zod";

/**
 * WordPress APIレスポンス用実績スキーマ
 * 実績もWordPressのカスタム投稿タイプ「works」を使用するため、WordPressPostと同じ構造
 */
export const WordPressWorkSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({ rendered: z.string() }),
  content: z.object({ rendered: z.string() }),
  excerpt: z.object({ rendered: z.string() }),
  date: z.string(),
  modified: z.string(),
  featured_media: z.number().optional(),
  tags: z.array(z.number()).optional(),
  _embedded: z
    .object({
      "wp:featuredmedia": z
        .array(z.object({ source_url: z.string() }))
        .optional(),
    })
    .optional(),
});

/**
 * WordPress APIレスポンス型
 */
export type WordPressWork = z.infer<typeof WordPressWorkSchema>;
