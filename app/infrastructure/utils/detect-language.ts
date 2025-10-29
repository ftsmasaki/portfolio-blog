/**
 * コード内容から言語を自動検出する純粋関数
 *
 * コード文字列の構文パターンを解析し、プログラミング言語を推定する。
 * 正規表現ベースの簡易的な検出を行い、`shiki`が対応する言語IDを返す。
 *
 * **検出可能な言語:**
 * - TypeScript / JavaScript（ES Modules構文、型アノテーションで区別）
 * - Python（`def`, `class`, `import`構文）
 * - Bash / Shell（シェバング、変数構文）
 * - HTML（DOCTYPE、HTMLタグ）
 * - CSS（セレクタ、`@`ルール）
 * - JSON（オブジェクト、配列構文）
 * - SQL（SQLキーワード）
 * - その他（`text`として返す）
 *
 * **純粋関数の特性:**
 * - 副作用を持たない（読み取り専用の処理）
 * - 同じ入力に対して常に同じ出力を返す
 * - 外部状態に依存しない（データベース、API呼び出しなし）
 * - 元のコード文字列を変更しない（不変性の維持）
 *
 * @param code - 検出対象のコード文字列
 * @returns 推定された言語名（shikiの言語ID）
 *   - 検出に失敗した場合は`undefined`
 *   - 空文字列の場合は`undefined`
 *   - デフォルトとして`"text"`を返すこともある
 *
 * @example
 * ```typescript
 * const code = "const x: number = 1;";
 * const lang = detectLanguage(code);
 * // 結果: "typescript"
 *
 * const pythonCode = "def hello(): pass";
 * const pythonLang = detectLanguage(pythonCode);
 * // 結果: "python"
 * ```
 */
export const detectLanguage = (code: string): string | undefined => {
  const trimmedCode = code.trim();
  if (!trimmedCode) return undefined;

  // TypeScript/JavaScript の判定
  if (
    /export\s+(?:const|function|class|interface|type|enum)\s+\w+/.test(
      trimmedCode
    ) ||
    /import\s+.*\s+from\s+['"]/.test(trimmedCode) ||
    /:\s*\w+\s*[=&]/.test(trimmedCode) // 型アノテーション風
  ) {
    // TypeScriptの可能性が高い構文があるかチェック
    if (
      /:\s*(?:string|number|boolean|Array<|Record<|Promise<)/.test(
        trimmedCode
      ) ||
      /interface\s+\w+|type\s+\w+\s*=/.test(trimmedCode)
    ) {
      return "typescript";
    }
    return "javascript";
  }

  // Python の判定
  if (
    /^def\s+\w+\(/.test(trimmedCode) ||
    /^class\s+\w+(?:\(|:)/.test(trimmedCode) ||
    /import\s+\w+|from\s+\w+\s+import/.test(trimmedCode)
  ) {
    return "python";
  }

  // Bash/Shell の判定
  if (
    /^#!\/bin\/(?:bash|sh)/.test(trimmedCode) ||
    /\$\{?\w+\}?|\.sh$|bash/.test(trimmedCode)
  ) {
    return "bash";
  }

  // HTML の判定
  if (/^<!DOCTYPE|<html|<head|<body|<div|<span/.test(trimmedCode)) {
    return "html";
  }

  // CSS の判定
  if (/^[.#]?\w+\s*\{|@(?:media|keyframes|import)/.test(trimmedCode)) {
    return "css";
  }

  // JSON の判定
  if (/^\s*\{.*\}\s*$|^\s*\[.*\]\s*$/.test(trimmedCode.replace(/\s/g, ""))) {
    return "json";
  }

  // SQL の判定
  if (/SELECT|INSERT|UPDATE|DELETE|CREATE\s+TABLE/.test(trimmedCode)) {
    return "sql";
  }

  // デフォルトはtext
  return "text";
};
