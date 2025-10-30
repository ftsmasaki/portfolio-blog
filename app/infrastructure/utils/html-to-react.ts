import { rehype } from "rehype";
import rehypePrettyCode, {
  type Options,
  type LineElement,
  type CharsElement,
} from "rehype-pretty-code";
import rehypeReact from "rehype-react";
import type { BuiltinTheme } from "shiki";
import * as React from "react";
import * as prod from "react/jsx-runtime";
import { detectLanguage } from "./detect-language";
import { addLineNumbers } from "./add-line-numbers";
import {
  getHeadingStyles,
  getParagraphStyles,
  getListStyles,
  getListItemStyles,
  getLinkStyles,
  getQuoteStyles,
  getImageStyles,
  getStrongStyles,
  getEmStyles,
  getInlineCodeStyles,
  getTableStyles,
} from "@/presentation/utils/prose-styles";
import { cn } from "@/presentation/utils/cn";
import { HeadingAnchorButton } from "@/presentation/components/common/heading-anchor-button";
import { transformLinkAttributes } from "./transform-link-attributes";

// 見出しにコピー用アンカーアイコンを表示し、クリックで#リンクをクリップボードにコピー
function renderHeadingWithCopy(level: 1 | 2 | 3 | 4 | 5 | 6, props: any) {
  const Tag = `h${level}` as string;
  const id: string | undefined = props.id;

  return React.createElement(
    Tag,
    {
      ...props,
      className: cn(
        "group relative scroll-mt-16", // ここで scroll-margin-top: 4rem (=64px) をTailwindUtilityで付与
        props.className,
        getHeadingStyles(level)
      ),
    },
    React.createElement(HeadingAnchorButton, {
      id,
      className: cn(
        "absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
      ),
    }),
    props.children
  );
}

/**
 * WordPressのコードブロックに言語クラスを追加する前処理（純粋関数）
 *
 * WordPressのGutenbergエディタで生成されるコードブロック（`<pre class="wp-block-code">`）を検出し、
 * 言語を自動検出して`rehype-pretty-code`が処理できる形式に変換する。
 * HTMLエンティティをデコードし、コード内容から言語を推定して`language-*`クラスを付与する。
 *
 * **純粋関数の特性:**
 * - 副作用を持たない（DOM操作、外部API呼び出しなし）
 * - 同じ入力に対して常に同じ出力を返す
 * - 外部状態に依存しない
 *
 * @param html - 処理するHTML文字列（WordPress記事コンテンツ）
 * @returns 言語クラスが追加されたHTML文字列
 *
 * @example
 * ```typescript
 * const html = '<pre class="wp-block-code"><code>const x = 1;</code></pre>';
 * const processed = preprocessWordPressCodeBlocks(html);
 * // 結果: '<pre><code class="language-typescript">const x = 1;</code></pre>'
 * ```
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
 * HTML文字列をReactElementに変換する純粋関数
 *
 * WordPress記事のHTMLコンテンツをReact要素に変換する。
 * シンタックスハイライト（`rehype-pretty-code`）を適用し、
 * 必要に応じてカスタムコンポーネントを注入できる設計になっている。
 *
 * **処理の流れ:**
 * 1. WordPressコードブロックの前処理（言語クラス追加）
 * 2. `rehype-pretty-code`によるシンタックスハイライト適用
 * 3. `rehype-react`によるReact要素への変換
 * 4. カスタムコンポーネントの注入（オプション）
 *
 * **純粋関数の特性:**
 * - 副作用を持たない（変換処理のみ）
 * - 同じ入力（`html`と`components`）に対して常に同じ出力を返す
 * - 外部状態に依存しない
 * - 依存関係の逆転（Dependency Inversion）を実現
 *   - 副作用を持つコンポーネントを外部から注入することで、純粋関数としての性質を維持
 *
 * @param html - 処理するHTML文字列（WordPress記事コンテンツ）
 * @param components - カスタムコンポーネントマップ（オプション）
 *   - 副作用を持つコンポーネント（例: `EnhancedCodeBlock`）を外部から注入可能
 *   - キーはHTML要素名（例: `"pre"`, `"code"`）
 *   - 値はReactコンポーネント
 * @returns ReactElement - 変換されたReact要素
 *
 * @example
 * ```typescript
 * const html = '<p>Hello, <code>world</code></p>';
 * const element = await htmlToReactElement(html, {
 *   pre: (props) => <EnhancedCodeBlock {...props} />
 * });
 * ```
 */
export const htmlToReactElement = async (
  html: string,
  components?: Record<string, React.ComponentType<any>>
): Promise<React.ReactElement> => {
  // WordPressのコードブロックを前処理
  const preprocessedHtml = preprocessWordPressCodeBlocks(html);

  // VSCode風のテーマとしてdark-plusを使用
  const theme: BuiltinTheme = "dark-plus";

  const rehypePrettyCodeOptions: Options = {
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

  // スタイル適用済みコンポーネントマップ
  const styledComponents: Record<string, React.ComponentType<any>> = {
    // 見出し
    h1: (props: any) => renderHeadingWithCopy(1, props),
    h2: (props: any) => renderHeadingWithCopy(2, props),
    h3: (props: any) => renderHeadingWithCopy(3, props),
    h4: (props: any) => renderHeadingWithCopy(4, props),
    h5: (props: any) => renderHeadingWithCopy(5, props),
    h6: (props: any) => renderHeadingWithCopy(6, props),
    // 段落
    p: (props: any) => {
      return React.createElement("p", {
        ...props,
        className: cn(props.className, getParagraphStyles()),
      });
    },
    // リスト
    ul: (props: any) => {
      return React.createElement("ul", {
        ...props,
        className: cn(props.className, getListStyles("ul")),
      });
    },
    ol: (props: any) => {
      return React.createElement("ol", {
        ...props,
        className: cn(props.className, getListStyles("ol")),
      });
    },
    li: (props: any) => {
      return React.createElement("li", {
        ...props,
        className: cn(props.className, getListItemStyles()),
      });
    },
    // リンク
    a: (props: any) => {
      const href = props.href || "";
      const externalAttributes = transformLinkAttributes(href);
      return React.createElement("a", {
        ...props,
        ...externalAttributes,
        className: cn(props.className, getLinkStyles()),
      });
    },
    // 引用
    blockquote: (props: any) => {
      return React.createElement("blockquote", {
        ...props,
        className: cn(props.className, getQuoteStyles()),
      });
    },
    // 画像
    img: (props: any) => {
      return React.createElement("img", {
        ...props,
        className: cn(props.className, getImageStyles()),
      });
    },
    // インライン装飾
    strong: (props: any) => {
      return React.createElement("strong", {
        ...props,
        className: cn(props.className, getStrongStyles()),
      });
    },
    em: (props: any) => {
      return React.createElement("em", {
        ...props,
        className: cn(props.className, getEmStyles()),
      });
    },
    // インラインコード（pre > codeの場合は除外）
    code: (props: any) => {
      // pre要素の子である場合はスタイルを適用しない（既存のコードブロック処理を使用）
      // rehype-pretty-codeが処理したcode要素は既にclassNameを持っているため、それを判定
      const className = props.className || [];
      const hasLanguageClass = Array.isArray(className)
        ? className.some(
            (cls: string) =>
              typeof cls === "string" && cls.startsWith("language-")
          )
        : false;

      // 言語クラスがある場合はコードブロックなのでインラインコードスタイルを適用しない
      if (hasLanguageClass) {
        return React.createElement("code", props);
      }
      return React.createElement("code", {
        ...props,
        className: cn(props.className, getInlineCodeStyles()),
      });
    },
    // テーブル
    table: (props: any) => {
      return React.createElement("table", {
        ...props,
        className: cn(props.className, getTableStyles("table")),
      });
    },
    thead: (props: any) => {
      return React.createElement("thead", {
        ...props,
        className: cn(props.className, getTableStyles("thead")),
      });
    },
    tbody: (props: any) => {
      return React.createElement("tbody", {
        ...props,
        className: cn(props.className, getTableStyles("tbody")),
      });
    },
    tr: (props: any) => {
      return React.createElement("tr", {
        ...props,
        className: cn(props.className, getTableStyles("tr")),
      });
    },
    th: (props: any) => {
      return React.createElement("th", {
        ...props,
        className: cn(props.className, getTableStyles("th")),
      });
    },
    td: (props: any) => {
      return React.createElement("td", {
        ...props,
        className: cn(props.className, getTableStyles("td")),
      });
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rehypeReactOptions: any = {
    Fragment: prod.Fragment,
    jsx: prod.jsx,
    jsxs: prod.jsxs,
    createElement: React.createElement,
    components: {
      // カスタムコンポーネント（既存のpre処理など）を優先
      ...components,
      // スタイル適用済みコンポーネント
      ...styledComponents,
    },
  };

  const processed = await rehype()
    .data("settings", { fragment: true })
    .use(rehypePrettyCode, rehypePrettyCodeOptions)
    .use(rehypeReact, rehypeReactOptions)
    .process(preprocessedHtml);

  // 行番号属性を追加（純粋関数による後処理）
  const resultWithLineNumbers = addLineNumbers(processed.result);

  return resultWithLineNumbers as React.ReactElement;
};
