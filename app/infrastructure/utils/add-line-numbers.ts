import * as React from "react";
import type { ReactNode } from "react";

/**
 * React要素ツリーの`code`要素に`data-line-numbers`属性を追加する純粋関数
 *
 * `rehype-pretty-code`によって処理されたコードブロックに行番号表示を有効化する。
 * `code`要素に`data-line-numbers`属性を追加し、CSSカウンターによる行番号表示を可能にする。
 *
 * **処理の流れ:**
 * 1. React要素ツリーを再帰的に走査
 * 2. `code`要素を発見した場合、`data-line-numbers`属性を追加
 * 3. 既に属性が存在する場合は追加しない（冪等性）
 *
 * **純粋関数の特性:**
 * - 副作用を持たない（読み取り専用 + 新しい要素ツリーを生成）
 * - 同じ入力に対して常に同じ出力を返す
 * - 外部状態に依存しない
 * - 元の要素ツリーを変更しない（不変性の維持、新しいツリーを生成）
 *
 * @param node - 処理対象のReactNode（コードブロックを含むReact要素ツリー）
 * @returns `data-line-numbers`属性が追加された新しいReact要素ツリー
 *
 * @example
 * ```typescript
 * const element = (
 *   <pre>
 *     <code>
 *       <span data-line="1">const x = 1;</span>
 *     </code>
 *   </pre>
 * );
 * const enhanced = addLineNumbers(element);
 * // 結果: <pre><code data-line-numbers>...</code></pre>
 * ```
 */
export const addLineNumbers = (node: ReactNode): ReactNode => {
  if (typeof node === "string" || typeof node === "number") {
    return node;
  }
  if (!node || typeof node !== "object") {
    return node;
  }
  if (React.isValidElement(node)) {
    const props = node.props as {
      children?: ReactNode;
      "data-line-numbers"?: boolean;
      [key: string]: unknown;
    };

    // code要素にdata-line-numbers属性を追加
    if (node.type === "code" && !props["data-line-numbers"]) {
      return React.cloneElement(
        node as React.ReactElement<unknown>,
        {
          ...props,
          "data-line-numbers": true,
        } as typeof props
      );
    }

    // 子要素を再帰的に処理
    if (!props.children) {
      return node;
    }

    const processedChildren = Array.isArray(props.children)
      ? props.children.map(addLineNumbers)
      : addLineNumbers(props.children);

    // 子要素が変更された場合のみ新しい要素を生成
    if (processedChildren !== props.children) {
      return React.cloneElement(
        node as React.ReactElement<unknown>,
        {
          ...props,
          children: processedChildren,
        } as typeof props
      );
    }

    return node;
  }
  return node;
};
