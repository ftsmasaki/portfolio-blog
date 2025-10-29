import { rehype } from "rehype";
import rehypePrettyCode, {
  type Options,
  type LineElement,
  type CharsElement,
} from "rehype-pretty-code";
import type { BuiltinTheme } from "shiki";
import { detectLanguage } from "./detect-language";

/**
 * WordPressのコードブロックに言語クラスを追加する前処理
 * @param html - 処理するHTML文字列
 * @returns 言語クラスが追加されたHTML文字列
 */
const preprocessWordPressCodeBlocks = (html: string): string => {
  // WordPressのコードブロック <pre class="wp-block-code"><code></code></pre> を検出
  // /s フラグの代わりに [\s\S] を使用（ES2018以前の互換性のため）
  const codeBlockRegex =
    /<pre\s+class=["']wp-block-code["']>\s*<code(?:[^>]*)>([\s\S]*?)<\/code>\s*<\/pre>/g;

  return html.replace(codeBlockRegex, (match, codeContent) => {
    // HTMLエンティティをデコード
    const decodedCode = codeContent
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    // 言語を自動検出
    const detectedLang = detectLanguage(decodedCode);

    // 言語クラスを追加したコードブロックに変換
    // rehype-pretty-codeが処理できる形式に変換
    if (detectedLang) {
      return `<pre><code class="language-${detectedLang}">${codeContent}</code></pre>`;
    }
    // 言語が検出できない場合はそのまま返す
    return `<pre><code>${codeContent}</code></pre>`;
  });
};

/**
 * HTML内のコードブロックにシンタックスハイライトを適用
 * @param html - 処理するHTML文字列
 * @returns 処理後のHTML文字列
 */
export const processCodeHighlight = async (html: string): Promise<string> => {
  // WordPressのコードブロックを前処理
  const preprocessedHtml = preprocessWordPressCodeBlocks(html);

  // VSCode風のテーマとしてdark-plusを使用
  // vscode-dark-modernはBundledThemeに含まれていないため、dark-plusを使用
  const theme: BuiltinTheme = "dark-plus";

  const options: Options = {
    theme,
    keepBackground: false,
    // 言語が指定されていない場合のデフォルト言語
    defaultLang: "text",
    // 行番号を有効化
    onVisitLine(node: LineElement) {
      // 各行にdata-line属性を追加
      if (node.children.length === 0) {
        node.children = [{ type: "text", value: " " }];
      }
    },
    onVisitHighlightedLine(node: LineElement, id: string | undefined) {
      // ハイライト行にdata-highlighted-line属性を追加
      const className = node.properties.className || [];
      node.properties.className = [...className, "line--highlighted"];
      if (id) {
        node.properties["data-id"] = id;
      }
    },
    onVisitHighlightedChars(node: CharsElement, id: string | undefined) {
      // ハイライト単語にdata-highlighted-chars属性を追加
      const className = node.properties.className || [];
      node.properties.className = [...className, "word--highlighted"];
      if (id) {
        node.properties["data-id"] = id;
      }
    },
  };

  const processed = await rehype()
    .data("settings", { fragment: true })
    .use(rehypePrettyCode, options)
    .process(preprocessedHtml);

  return processed.toString();
};
