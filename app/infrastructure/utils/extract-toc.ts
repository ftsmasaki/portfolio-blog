import { rehype } from "rehype";
import rehypeSlug from "rehype-slug";
// 見出しはリンク化せず、コピーアイコンで対応するためautolinkは使用しない
import rehypeExtractToc from "@stefanprobst/rehype-extract-toc";

export interface TocEntry {
  id: string;
  text: string;
  depth: number; // h2 -> 2, h3 -> 3
  children?: TocEntry[];
}

export interface BuildHtmlAndTocOptions {
  headings?: Array<"h1" | "h2" | "h3" | "h4" | "h5" | "h6">;
}

/**
 * WordPressのcontent.rendered(HTML)から見出しID付与とTOC抽出を行い、
 * 加工済みHTMLとTOC配列を返す。
 */
export const buildHtmlAndToc = async (
  html: string,
  options?: BuildHtmlAndTocOptions
): Promise<{ html: string; toc: TocEntry[] }> => {
  const headings = options?.headings ?? ["h2", "h3", "h4"];

  const processor = rehype()
    .data("settings", { fragment: true })
    .use(rehypeSlug);

  // 見出しはリンク化せず、そのままidのみ付与

  processor.use(rehypeExtractToc, { headings });

  const file = await processor.process(html);

  const processedHtml = String(file);

  // 正規化: pluginのtitle/text/valueが配列/ノードのことがある
  type RawNode =
    | { value?: string; children?: RawNode[] }
    | string
    | null
    | undefined;
  const isNodeObject = (n: RawNode): n is { value?: string; children?: RawNode[] } =>
    typeof n === "object" && n !== null;

  const toPlainText = (node: RawNode): string => {
    if (!node) return "";
    if (typeof node === "string") return node;
    if (isNodeObject(node) && typeof node.value === "string") return node.value;
    const children = isNodeObject(node) ? node.children : undefined;
    return Array.isArray(children) ? children.map(toPlainText).join("") : "";
  };

  interface TocRawItem {
    id?: string;
    url?: string;
    title?: RawNode | RawNode[];
    text?: RawNode | RawNode[];
    value?: RawNode;
    depth?: number;
    rank?: number;
    children?: TocRawItem[];
  }

  const normalize = (item: TocRawItem): TocEntry => {
    const id: string =
      item?.id ??
      (typeof item?.url === "string" ? item.url.replace(/^#/, "") : "");
    const title = item?.title ?? item?.text ?? item?.value;
    const text: string = Array.isArray(title)
      ? title.map(toPlainText).join("")
      : toPlainText(title as RawNode);
    const depth: number =
      typeof item?.depth === "number"
        ? item.depth
        : typeof item?.rank === "number"
        ? item.rank
        : 0;
    const children: TocEntry[] = Array.isArray(item?.children)
      ? item.children.map(normalize)
      : [];
    return { id, text, depth, children };
  };

  const raw = (file.data as { toc?: TocRawItem[] }).toc ?? [];
  const toc: TocEntry[] = Array.isArray(raw) ? raw.map(normalize) : [];
  return { html: processedHtml, toc };
};
