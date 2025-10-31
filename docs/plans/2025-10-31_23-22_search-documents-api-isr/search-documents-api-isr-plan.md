# 検索ドキュメントAPI + ISR 供給計画書

## 概要（背景・目的）
- WordPress REST APIから取得した記事を元に、検索用の軽量ドキュメント（id/title/excerpt/slug など）を提供する。
- App RouterのRoute Handler（`/api/search-documents`）で供給し、オンデマンドISRと連携して最新化する。
- フロントはモーダルオープン時にAPIから取得し、FlexSearchのインデックスをクライアントで構築してリアルタイム検索を実現する。

## 現在の状況
- 検索UI（モーダル、バー、結果）は実装済。
- FlexSearchのインデックス作成・検索関数は実装済（クライアント）。
- 供給データ（検索ドキュメント）のAPIが未整備。

## アーキテクチャ概要
- Route Handler: `/api/search-documents`（GET）
  - WordPress REST APIから記事一覧を取得
  - `postToSearchableDocument`で検索用ドキュメントに変換
  - 軽量JSONで返却
  - `next: { tags: ['search-index'] }` を付与
- オンデマンドISR:
  - 既存の`/api/revalidate`から記事再生成時に`revalidateTag('search-index')`も呼ぶ
- フロント:
  - モーダルオープン時に `/api/search-documents` をfetch（メモ化）
  - 取得後にFlexSearchインデックスを構築し、入力に応じて検索

## 実装計画（段階的フェーズ）
### フェーズ A.1: APIの土台
- `/app/app/api/search-documents/route.ts` を新規作成
- GETで検索用ドキュメント配列を返却
- `next: { tags: ['search-index'] }` を付与

### フェーズ A.2: 変換・型・バリデーション
- `SearchableDocument`の再利用（既存）
- 変換関数（`postToSearchableDocument`）をサーバー側でも利用可能に
- 必要に応じてZod等でレスポンス検証（軽量でよい）

### フェーズ A.3: ISR連携
- 既存の`/app/app/api/revalidate/route.ts`で記事再生成時に`revalidateTag('search-index')`を追加呼び出し
- 検索データの鮮度を記事再生成と同タイミングで担保

### フェーズ A.4: フロント接続
- 検索モーダルオープン時に`/api/search-documents`をfetch
- 取得結果をメモ化し、FlexSearchインデックスを`useMemo`で構築
- 入力毎にクエリ検索→結果表示

### フェーズ A.5: 型・テスト・チェンジログ
- 型チェック（`npx tsc --noEmit`）
- 主要ユーティリティの単体テスト（Node環境）
- チェンジログ作成

## 詳細設計（要点）
- API I/O:
  - Request: GET `/api/search-documents`
  - Response: `Array<{ id: number; title: string; excerpt: string; slug: string; content?: string }>`
- 取得元: WordPress REST API（公開記事のみ、必要なフィールドに限定）
- キャッシュ/タグ: `tags: ['search-index']` によりオンデマンドISRで再検証
- エラーハンドリング: 取得失敗時は`503`（JSONでメッセージ）、フロントはフォールバック表示
- パフォーマンス: 返却データは軽量化（contentは必要に応じてトリム/省略）

## 成功指標
- 型エラー0件
- `/api/search-documents` がSSG後に利用可能
- オンデマンドISR後に検索データが更新
- 検索モーダルでリアルタイムに絞り込みが動作

## 付記（将来拡張）
- 日本語検索精度向上のための事前分かち/簡易N-gram化
- ドキュメントの重み付け（title高ウェイト）
- サーバー側でFlexSearchエクスポート配信（大規模化時）
