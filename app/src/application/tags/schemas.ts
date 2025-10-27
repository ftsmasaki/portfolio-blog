import { z } from "zod";

/**
 * WordPress APIレスポンス用タグスキーマ
 */
export const WordPressTagSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  taxonomy: z.string(),
  count: z.number(),
});

/**
 * WordPress APIレスポンス型
 */
export type WordPressTag = z.infer<typeof WordPressTagSchema>;
