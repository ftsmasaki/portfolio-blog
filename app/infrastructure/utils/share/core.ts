export interface UTMOptions {
  source: string;
  medium: string;
  campaign: string;
}

export interface SharePayload {
  url: string;
  title: string;
  site?: string;
  hashtags?: string[];
  via?: string;
  utm?: UTMOptions;
}

export const encode = (value: string): string => encodeURIComponent(value);

export const buildShareUrl = (
  baseUrl: string,
  query: Record<string, string>,
  utm?: UTMOptions
): string => {
  const url = new URL(baseUrl);
  const params = new URLSearchParams(query);
  if (utm) {
    params.set("utm_source", utm.source);
    params.set("utm_medium", utm.medium);
    params.set("utm_campaign", utm.campaign);
  }
  // Preserve existing params in baseUrl
  url.searchParams.forEach((v, k) => {
    params.set(k, v);
  });
  url.search = params.toString();
  return url.toString();
};

export const applyUtm = (url: string, utm?: UTMOptions): string => {
  if (!utm) return url;
  const u = new URL(url);
  u.searchParams.set("utm_source", utm.source);
  u.searchParams.set("utm_medium", utm.medium);
  u.searchParams.set("utm_campaign", utm.campaign);
  return u.toString();
};

export const buildMarkdownLink = (input: {
  title: string;
  url: string;
}): string => {
  return `[${input.title}](${input.url})`;
};

export const buildPlainText = (input: {
  title: string;
  site?: string;
  url: string;
}): string => {
  const site = input.site ? ` – ${input.site}` : "";
  return `${input.title}${site} ${input.url}`;
};
