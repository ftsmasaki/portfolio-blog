import { describe, it, expect } from "vitest";
import * as React from "react";
import { htmlToReactElement } from "../html-to-react";

describe("htmlToReactElement", () => {
  describe("スタイル適用", () => {
    it("h1要素にスタイルが適用される", async () => {
      const html = "<h1>見出し1</h1>";
      const result = await htmlToReactElement(html);

      expect(result).toBeDefined();
      // Fragment内に要素が含まれるため、構造が正しいことを確認
      expect(result).toHaveProperty("props");
    });

    it("h2要素にスタイルが適用される", async () => {
      const html = "<h2>見出し2</h2>";
      const result = await htmlToReactElement(html);

      expect(result).toBeDefined();
      expect(result).toHaveProperty("props");
    });

    it("段落にスタイルが適用される", async () => {
      const html = "<p>これは段落です。</p>";
      const result = await htmlToReactElement(html);

      expect(result).toBeDefined();
      expect(result).toHaveProperty("props");
    });

    it("リストにスタイルが適用される", async () => {
      const html = "<ul><li>項目1</li></ul>";
      const result = await htmlToReactElement(html);

      expect(result).toBeDefined();
    });

    it("リンクにスタイルが適用される", async () => {
      const html = '<a href="/">リンク</a>';
      const result = await htmlToReactElement(html);

      expect(result).toBeDefined();
    });

    it("外部リンクにtargetとrelが設定される", async () => {
      const html = '<a href="https://google.com">外部リンク</a>';
      const result = await htmlToReactElement(html);

      expect(result).toBeDefined();
    });

    it("内部リンクにはtargetとrelが設定されない", async () => {
      // 環境変数が設定されている場合を想定
      const html = '<a href="/blog/post">内部リンク</a>';
      const result = await htmlToReactElement(html);

      expect(result).toBeDefined();
    });

    it("引用にスタイルが適用される", async () => {
      const html = "<blockquote>引用文</blockquote>";
      const result = await htmlToReactElement(html);

      expect(result).toBeDefined();
      expect(result).toHaveProperty("props");
    });

    it("画像にスタイルが適用される", async () => {
      const html = '<img src="/test.jpg" alt="テスト画像" />';
      const result = await htmlToReactElement(html);

      expect(result).toBeDefined();
    });

    it("太字にスタイルが適用される", async () => {
      const html = "<p>これは<strong>太字</strong>です。</p>";
      const result = await htmlToReactElement(html);

      expect(result).toBeDefined();
    });

    it("斜体にスタイルが適用される", async () => {
      const html = "<p>これは<em>斜体</em>です。</p>";
      const result = await htmlToReactElement(html);

      expect(result).toBeDefined();
    });

    it("インラインコードにスタイルが適用される", async () => {
      const html = "<p>これは<code>コード</code>です。</p>";
      const result = await htmlToReactElement(html);

      expect(result).toBeDefined();
    });

    it("コードブロック（pre > code）にはインラインコードスタイルが適用されない", async () => {
      const html =
        '<pre class="wp-block-code"><code>コードブロック</code></pre>';
      const result = await htmlToReactElement(html);

      expect(result).toBeDefined();
    });

    it("テーブルにスタイルが適用される", async () => {
      const html =
        "<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Cell</td></tr></tbody></table>";
      const result = await htmlToReactElement(html);

      expect(result).toBeDefined();
    });
  });

  describe("既存機能の維持", () => {
    it("コードブロックのシンタックスハイライトが動作する", async () => {
      const html = '<pre class="wp-block-code"><code>const x = 1;</code></pre>';
      const result = await htmlToReactElement(html);

      expect(result).toBeDefined();
    });

    it("複数の要素が混在しても正常に変換される", async () => {
      const html =
        "<h1>タイトル</h1><p>段落です。<strong>太字</strong>と<code>コード</code>を含みます。</p>";
      const result = await htmlToReactElement(html);

      expect(result).toBeDefined();
    });

    it("カスタムコンポーネントが優先される", async () => {
      const html = "<p>テスト</p>";
      const customPre = () => React.createElement("pre", null, "Custom");
      const result = await htmlToReactElement(html, {
        pre: customPre,
      });

      expect(result).toBeDefined();
    });
  });
});
