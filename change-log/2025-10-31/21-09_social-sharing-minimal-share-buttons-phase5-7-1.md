# フェーズ5.7.1: 共有ボタン最小実装（Social Sharing）

## 1. 何を (What)
- 記事詳細ページに共有機能の最小セットを実装
  - X(Twitter) 共有リンク生成（UTM付与）
  - リンクのプレーンテキストコピー
  - Markdownリンクのコピー
- 共有リンク生成の純粋関数群（URL/UTM/Markdown/PlainText、Twitter Intent）を追加
- `blog/[slug]/page.tsx` に `ShareButtons` を組み込み

変更ファイル:
- `app/infrastructure/utils/share/core.ts`（追加）
- `app/infrastructure/utils/share/twitter.ts`（追加）
- `app/infrastructure/utils/share/index.ts`（追加）
- `app/presentation/components/blog/share-buttons.tsx`（追加）
- `app/app/blog/[slug]/page.tsx`（編集）

## 2. どんな目的で (Why)
- 記事拡散と再共有導線の強化のため、最も利用頻度の高い共有手段を先行提供
- UTM付与により共有起点（source）計測の基礎を用意
- 関数型の分離により後続のSlack/Discord/Notion整形やOGP拡張を容易化

## 3. どう変更したか (How)
- 共有用の純粋関数（`core.ts`）
  - `buildShareUrl(baseUrl, query, utm)` で任意クエリとUTMを合成
  - `applyUtm(url, utm)` で既存URLへUTM付与
  - `buildMarkdownLink({ title, url })`/`buildPlainText({ title, site, url })`
- X(Twitter) 用ビルダー（`twitter.ts`）
  - `buildTwitterIntent(payload)` で `https://twitter.com/intent/tweet` を構築（title/url/hashtags/via/UTM）
- UI 実装（`ShareButtons`）
  - ボタン: X共有/リンクコピー/Markdownコピー
  - コピーは `navigator.clipboard.writeText` を使用、`aria-live` で成功/失敗通知
  - UTMは `source` を媒体で切替（twitter）`medium=social`/`campaign=share_button`
- ページ組み込み
  - `PostHeader` 直下に `ShareButtons` を追加
  - URLは `NEXT_PUBLIC_SITE_URL` をベースに `/blog/{slug}` を合成

## 4. 考えられる影響と範囲
- 既存レイアウトへの軽微なUI追加（記事ページのみ）
- クリップボードAPIは HTTPS 前提（ローカル開発は問題なし、デプロイ環境でHTTPS運用を前提）
- 今後の拡張（Slack/Discord/Notion/Toast UI/OGP画像）に影響なく段階的追加可能

## 5. 課題
- UIトースト（成功/失敗通知）は暫定: `aria-live`。デザイン済みトースト導入で置換予定
- 媒体別のハッシュタグ/viaなどの拡張設定は未導入（後続で検討）
- OGPメタ/画像は次フェーズ（5.7.2/5.7.3）で対応

---
品質チェック:
- 型チェック: OK（`cd app && yarn type-check`）
- 既存テスト: OK（`cd app && yarn test:run -w=false` すべてパス）
- Lintエラー: なし


