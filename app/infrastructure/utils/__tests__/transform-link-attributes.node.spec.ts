import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  isExternalLink,
  transformLinkAttributes,
} from "../transform-link-attributes";

describe("transform-link-attributes", () => {
  const originalLocalUrl = process.env.NEXT_PUBLIC_APP_URL_LOCAL;
  const originalProductionUrl = process.env.NEXT_PUBLIC_APP_URL_PRODUCTION;

  beforeEach(() => {
    // テスト用の環境変数を設定
    process.env.NEXT_PUBLIC_APP_URL_LOCAL = "http://localhost:3031";
    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION = "https://example.com";
  });

  afterEach(() => {
    // 環境変数を元に戻す
    process.env.NEXT_PUBLIC_APP_URL_LOCAL = originalLocalUrl;
    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION = originalProductionUrl;
  });

  describe("isExternalLink", () => {
    it("内部リンク（NEXT_PUBLIC_APP_URL_LOCAL）で始まる場合はfalseを返す", () => {
      const result = isExternalLink("http://localhost:3031/blog/post");
      expect(result).toBe(false);
    });

    it("内部リンク（NEXT_PUBLIC_APP_URL_PRODUCTION）で始まる場合はfalseを返す", () => {
      const result = isExternalLink("https://example.com/blog/post");
      expect(result).toBe(false);
    });

    it("相対パス（/で始まる）の場合はfalseを返す", () => {
      const result = isExternalLink("/blog/post");
      expect(result).toBe(false);
    });

    it("外部リンク（https://で始まる）の場合はtrueを返す", () => {
      const result = isExternalLink("https://google.com");
      expect(result).toBe(true);
    });

    it("外部リンク（http://で始まる）の場合はtrueを返す", () => {
      const result = isExternalLink("http://example.org");
      expect(result).toBe(true);
    });

    it("内部リンクURLと同じドメインでも完全一致でない場合はtrueを返す", () => {
      const result = isExternalLink("https://example.org/page");
      expect(result).toBe(true);
    });

    it("同じ入力に対して常に同じ出力を返す（純粋関数）", () => {
      const href = "https://google.com";
      const result1 = isExternalLink(href);
      const result2 = isExternalLink(href);
      expect(result1).toBe(result2);
      expect(result1).toBe(true);
    });

    describe("環境変数が設定されていない場合", () => {
      beforeEach(() => {
        process.env.NEXT_PUBLIC_APP_URL_LOCAL = "";
        process.env.NEXT_PUBLIC_APP_URL_PRODUCTION = "";
      });

      it("絶対URL（https://）は外部リンクとして判定される", () => {
        const result = isExternalLink("https://google.com");
        expect(result).toBe(true);
      });

      it("絶対URL（http://）は外部リンクとして判定される", () => {
        const result = isExternalLink("http://google.com");
        expect(result).toBe(true);
      });

      it("相対パスは内部リンクとして判定される", () => {
        const result = isExternalLink("/blog/post");
        expect(result).toBe(false);
      });
    });
  });

  describe("transformLinkAttributes", () => {
    it("外部リンクの場合はtargetとrelを返す", () => {
      const result = transformLinkAttributes("https://google.com");
      expect(result).toEqual({
        target: "_blank",
        rel: "noopener noreferrer",
      });
    });

    it("内部リンク（NEXT_PUBLIC_APP_URL_LOCAL）の場合は空オブジェクトを返す", () => {
      const result = transformLinkAttributes("http://localhost:3031/blog/post");
      expect(result).toEqual({});
    });

    it("内部リンク（NEXT_PUBLIC_APP_URL_PRODUCTION）の場合は空オブジェクトを返す", () => {
      const result = transformLinkAttributes("https://example.com/blog/post");
      expect(result).toEqual({});
    });

    it("相対パスの場合は空オブジェクトを返す", () => {
      const result = transformLinkAttributes("/blog/post");
      expect(result).toEqual({});
    });

    it("同じ入力に対して常に同じ出力を返す（純粋関数）", () => {
      const href = "https://google.com";
      const result1 = transformLinkAttributes(href);
      const result2 = transformLinkAttributes(href);
      expect(result1).toEqual(result2);
      expect(result1).toEqual({
        target: "_blank",
        rel: "noopener noreferrer",
      });
    });
  });
});
