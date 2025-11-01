import { describe, it, expect } from "vitest";
import {
  isExternalLink,
  transformLinkAttributes,
} from "../transform-link-attributes";

describe("transform-link-attributes", () => {
  const ORIGIN_LOCAL = "http://localhost:3031";
  const ORIGIN_PROD = "https://example.com";

  describe("isExternalLink", () => {
    it("同一オリジン（ローカル）に一致する絶対URLは内部リンク（false）", () => {
      const result = isExternalLink("http://localhost:3031/blog/post", ORIGIN_LOCAL);
      expect(result).toBe(false);
    });

    it("同一オリジン（本番）に一致する絶対URLは内部リンク（false）", () => {
      const result = isExternalLink("https://example.com/blog/post", ORIGIN_PROD);
      expect(result).toBe(false);
    });

    it("相対パス（/で始まる）の場合はfalseを返す", () => {
      const result = isExternalLink("/blog/post", ORIGIN_PROD);
      expect(result).toBe(false);
    });

    it("外部リンク（https://で始まる）の場合はtrueを返す", () => {
      const result = isExternalLink("https://google.com", ORIGIN_PROD);
      expect(result).toBe(true);
    });

    it("外部リンク（http://で始まる）の場合はtrueを返す", () => {
      const result = isExternalLink("http://example.org", ORIGIN_PROD);
      expect(result).toBe(true);
    });

    it("異なるオリジンは外部リンクとしてtrue", () => {
      const result = isExternalLink("https://example.org/page", ORIGIN_PROD);
      expect(result).toBe(true);
    });

    it("同じ入力に対して常に同じ出力を返す（純粋関数）", () => {
      const href = "https://google.com";
      const result1 = isExternalLink(href, ORIGIN_PROD);
      const result2 = isExternalLink(href, ORIGIN_PROD);
      expect(result1).toBe(result2);
      expect(result1).toBe(true);
    });

    describe("currentOrigin 未指定の場合の保守的判定", () => {
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
      const result = transformLinkAttributes("https://google.com", ORIGIN_PROD);
      expect(result).toEqual({
        target: "_blank",
        rel: "noopener noreferrer",
      });
    });

    it("同一オリジン（ローカル）の場合は空オブジェクトを返す", () => {
      const result = transformLinkAttributes(
        "http://localhost:3031/blog/post",
        ORIGIN_LOCAL,
      );
      expect(result).toEqual({});
    });

    it("同一オリジン（本番）の場合は空オブジェクトを返す", () => {
      const result = transformLinkAttributes(
        "https://example.com/blog/post",
        ORIGIN_PROD,
      );
      expect(result).toEqual({});
    });

    it("相対パスの場合は空オブジェクトを返す", () => {
      const result = transformLinkAttributes("/blog/post", ORIGIN_PROD);
      expect(result).toEqual({});
    });

    it("同じ入力に対して常に同じ出力を返す（純粋関数）", () => {
      const href = "https://google.com";
      const result1 = transformLinkAttributes(href, ORIGIN_PROD);
      const result2 = transformLinkAttributes(href, ORIGIN_PROD);
      expect(result1).toEqual(result2);
      expect(result1).toEqual({
        target: "_blank",
        rel: "noopener noreferrer",
      });
    });
  });
});
