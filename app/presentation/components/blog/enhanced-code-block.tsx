"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/presentation/utils/cn";
import type { ReactNode } from "react";
import { extractCodeText } from "@/infrastructure/utils/extract-code-text";

interface EnhancedCodeBlockProps {
  /** コードブロックの子要素（`rehype-pretty-code`によって処理されたReact要素） */
  children: ReactNode;
  /** 追加のCSSクラス名 */
  className?: string;
  /** コードの言語（`rehype-pretty-code`によって`data-language`属性として付与される） */
  "data-language"?: string;
}

/**
 * コードブロックを拡張するReactコンポーネント
 *
 * `rehype-pretty-code`によってシンタックスハイライトされたコードブロックを表示し、
 * コピーボタン機能を提供する。VSCode風のダークテーマ（dark-plus）でスタイリングされている。
 *
 * **主な機能:**
 * - シンタックスハイライトされたコードの表示
 * - コードのコピー機能（クリップボードAPI使用）
 * - コピー成功時の視覚的フィードバック（チェックマーク表示）
 * - ホバー時のコピーボタン表示（フェードイン/アウト）
 *
 * **注意事項:**
 * - このコンポーネントは副作用を持つ（`useState`, `navigator.clipboard`, `setTimeout`）
 * - コードテキストの抽出には純粋関数`extractCodeText`を使用
 * - クライアントコンポーネント（`"use client"`）として動作
 *
 * @param props - コンポーネントのプロップス
 * @param props.children - コードブロックの子要素
 * @param props.className - 追加のCSSクラス名
 * @param props.data-language - コードの言語識別子
 *
 * @example
 * ```tsx
 * <EnhancedCodeBlock data-language="typescript">
 *   <code>
 *     <span className="token keyword">const</span> x = 1;
 *   </code>
 * </EnhancedCodeBlock>
 * ```
 */
export const EnhancedCodeBlock = ({
  children,
  className,
  "data-language": language,
}: EnhancedCodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  // 純粋関数を使用してコードテキストを抽出
  const codeText = extractCodeText(children);

  const handleCopy = async () => {
    if (!codeText) return;
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative group my-6 rounded-lg overflow-hidden border border-border bg-[#1e1e1e]">
      {/* コピーボタン */}
      <button
        onClick={handleCopy}
        className={cn(
          "absolute top-1.5 right-1.5 z-10",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "p-1 rounded",
          "bg-black/50 hover:bg-black/70",
          "text-gray-300 hover:text-white",
          "flex items-center justify-center",
          "w-6 h-6"
        )}
        aria-label="コードをコピー"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-green-400" strokeWidth={2} />
        ) : (
          <Copy className="w-3.5 h-3.5" strokeWidth={2} />
        )}
      </button>

      {/* コードブロック */}
      <pre
        className={cn(
          "overflow-x-auto",
          "bg-[#1e1e1e] text-[#d4d4d4]",
          "p-4 font-mono text-sm leading-relaxed",
          "[&_code]:bg-transparent [&_code]:text-inherit",
          // 行番号表示のスタイル
          "[&_code[data-line-numbers]]:grid",
          "[&_code[data-line-numbers]]:auto-rows-fr",
          "[&_code[data-line-numbers]]:[counter-reset:line]",
          "[&_code[data-line-numbers]_span[data-line]::before]:content-[counter(line)]",
          "[&_code[data-line-numbers]_span[data-line]::before]:[counter-increment:line]",
          "[&_code[data-line-numbers]_span[data-line]::before]:mr-3",
          "[&_code[data-line-numbers]_span[data-line]::before]:inline-block",
          "[&_code[data-line-numbers]_span[data-line]::before]:w-8",
          "[&_code[data-line-numbers]_span[data-line]::before]:text-right",
          "[&_code[data-line-numbers]_span[data-line]::before]:text-gray-600",
          "[&_code[data-line-numbers]_span[data-line]::before]:select-none",
          className
        )}
        data-language={language}
      >
        {children}
      </pre>
    </div>
  );
};
