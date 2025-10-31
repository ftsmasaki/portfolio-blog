import type { SharePayload } from "./core";
import { buildShareUrl, encode } from "./core";

export const buildTwitterIntent = (payload: SharePayload): string => {
  const base = "https://twitter.com/intent/tweet";
  const text = payload.title;
  const query: Record<string, string> = {
    url: payload.url,
    text,
  };
  if (payload.hashtags && payload.hashtags.length > 0) {
    query.hashtags = payload.hashtags.map(encode).join(",");
  }
  if (payload.via) {
    query.via = encode(payload.via);
  }
  return buildShareUrl(base, query, payload.utm);
};
