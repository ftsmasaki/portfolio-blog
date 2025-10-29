import * as React from "react";
import type { ReactNode } from "react";

/**
 * ReactNodeからコードテキストを抽出する純粋関数
 *
 * `rehype-pretty-code`によって処理されたReact要素ツリーから、
 * 実際のコードテキスト（プレーンテキスト）を再帰的に抽出する。
 * 主にコードブロックのコピー機能などで使用される。
 *
 * **処理の流れ:**
 * 1. 文字列・数値の場合はそのまま返す
 * 2. React要素の場合、`children`を再帰的に処理
 * 3. `code`要素の場合は特に注目してテキストを抽出
 * 4. 配列の場合は各要素を結合
 *
 * **純粋関数の特性:**
 * - 副作用を持たない（読み取り専用の処理）
 * - 同じ入力に対して常に同じ出力を返す
 * - 外部状態に依存しない
 * - 元のデータ構造を変更しない（不変性の維持）
 *
 * @param node - 抽出対象のReactNode（rehype-pretty-codeの構造に対応）
 * @returns 抽出されたコードテキスト（プレーンテキスト）
 *
 * @example
 * ```typescript
 * const element = (
 *   <pre>
 *     <code>
 *       <span>const</span> x = 1;
 *     </code>
 *   </pre>
 * );
 * const text = extractCodeText(element);
 * // 結果: "const x = 1;"
 * ```
 */
export const extractCodeText = (node: ReactNode): string => {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node || typeof node !== "object") return "";
  if (React.isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    if (!props.children) return "";
    if (node.type === "code") {
      // code要素の場合は子要素からテキストを取得
      if (Array.isArray(props.children)) {
        return props.children.map(extractCodeText).join("");
      }
      return extractCodeText(props.children);
    }
    // その他の要素も再帰的に処理
    if (Array.isArray(props.children)) {
      return props.children.map(extractCodeText).join("");
    }
    return extractCodeText(props.children);
  }
  return "";
};
