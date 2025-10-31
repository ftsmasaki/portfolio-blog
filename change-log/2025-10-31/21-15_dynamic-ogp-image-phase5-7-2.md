# フェーズ5.7.2: OGP画像の動的生成

## 1. 何を (What)
- 記事単位のOGP画像エンドポイントを追加（/blog/[slug]/opengraph-image）
- サイト共通のフォールバックOGP画像を追加（/opengraph-image）
- next/og の ImageResponse により 1200x630 PNG をSSR生成

変更ファイル:
- app/app/blog/[slug]/opengraph-image.tsx（追加）
- app/app/opengraph-image.tsx（追加）

## 2. どんな目的で (Why)
- 共有時の視認性とクリック率向上
- 取得失敗時も共通の見栄えを担保

## 3. どう変更したか (How)
- 記事用: getPostBySlug(slug) で記事取得し、タイトル/日付/サイト名/slugを描画
- 共通用: サイト名/ホスト名のみ描画
- フォント: Noto Sans JP をオンライン取得（失敗時はフォールバック）
- 背景: ダーク系グラデーション

## 4. 影響と範囲
- 表示層の追加で既存機能への影響は限定的
- フォント取得失敗時も描画は継続

## 5. 課題
- 画像キャッシュ/ISR戦略の最適化
- フォント配信の安定化（将来的にローカル同梱検討）

---
品質チェック:
- 型チェック: OK（cd app && yarn type-check）
- 既存テスト: OK（cd app && yarn test:run -w=false 全件パス）
- Lintエラー: なし

## 6. 追加: DRYリファクタ（OGP生成の共通化）
- 共通処理を `presentation/utils/og.ts` に切り出し、両 `opengraph-image.tsx` から参照

変更ファイル:
- app/presentation/utils/og.ts（追加）
- app/app/opengraph-image.tsx（編集）
- app/app/blog/[slug]/opengraph-image.tsx（編集）

提供ユーティリティ:
- `OG_SIZE`, `OG_CONTENT_TYPE`, `DEFAULT_BACKGROUND`
- `loadNotoSansJpRegular()`, `buildFonts(fontData)`, `getHostFromEnv()`

理由/効果:
- 重複削減と保守性向上。背景/フォント/サイズを一元管理
