# フェーズ2.7: オンデマンドISR対応

## 何を (What)

フェーズ2.7の完了として、WordPress管理画面での更新をほぼリアルタイムで反映するオンデマンドISR機能を実装しました。

### 実装したファイル

1. **On-Demand Revalidation API** (`app/app/api/revalidate/route.ts`)
   - WordPress On-Demand RevalidationプラグインからのWebhookを受信するAPIエンドポイント
   - セキュリティトークンによる認証機能
   - パスベース・タグベースのリアバリデーション機能
   - 型別（post/work/tag）のリアバリデーション機能

2. **APIルート定数の更新** (`app/shared/constants/routes.ts`)
   - `API_ROUTES`に`REVALIDATE: "/api/revalidate"`を追加

## どんな目的で (Why)

このフェーズの目的は、WordPress管理画面での更新をほぼリアルタイムでNext.jsの静的ページに反映することでした。

具体的には：
- WordPressで記事を公開・更新・削除した際に、自動的にNext.jsのキャッシュを無効化
- 手動での再デプロイ不要でコンテンツ更新を反映
- パフォーマンスを保ちながら、最新のコンテンツを提供

## どう変更したか (How)

### 1. On-Demand Revalidation APIの実装

`app/app/api/revalidate/route.ts`にPOSTハンドラーを実装しました。

#### セキュリティトークンによる認証

HTTPヘッダー`x-revalidate-secret`からトークンを取得し、環境変数`REVALIDATE_SECRET`と比較して認証を行います。トークンが一致しない場合は401エラーを返します。

#### パスベース・タグベースのリアバリデーション

リクエストボディから`path`、`tag`、`type`を取得し、それぞれに応じたリアバリデーションを実行します。

- `path`が指定された場合: `revalidatePath(path, 'page')`で指定パスを無効化
- `tag`が指定された場合: `revalidateTag(tag, '')`で指定タグを無効化

#### 型別のリアバリデーション

`type`に応じて、関連するページを一括で無効化します：

- `type === 'post'`: `/blog`、`/blog/[slug]`、`/`を無効化し、`posts`タグを無効化
- `type === 'work'`: `/works`、`/works/[slug]`を無効化し、`works`タグを無効化
- `type === 'tag'`: `/tags`、`/blog`を無効化し、`tags`タグを無効化

### 2. APIルート定数の追加

`app/shared/constants/routes.ts`の`API_ROUTES`に`REVALIDATE: "/api/revalidate"`を追加し、型安全なルート定義を提供しました。

### 3. 型エラーの修正

Next.js 16の型定義により、`revalidateTag`関数には2つの引数（`tag`と`profile`）が必要であることが判明しました。すべての`revalidateTag`呼び出しに第2引数として空文字列を追加しました。

## 考えられる影響と範囲

### 既存機能への影響

- 今回の変更は新規APIエンドポイントの追加のみで、既存のコードへの影響はありません
- WordPressプラグインとの連携が必要で、プラグインの設定を適切に行う必要があります

### ユーザーエクスペリエンスへの影響

- WordPressで記事を公開・更新した際に、ほぼリアルタイムでサイトに反映されるようになります
- 手動での再デプロイが不要になり、コンテンツ更新のレスポンスが向上します

### パフォーマンスへの影響

- オンデマンドISRにより、必要な時のみページを再生成するため、パフォーマンスへの影響は最小限です
- キャッシュの無効化は必要最小限に抑えられる設計となっています

## 環境変数の設定

以下の環境変数を`.env.local`に設定する必要があります：

```env
# On-Demand Revalidation
REVALIDATE_SECRET=your-secret-token-here
```

## WordPressプラグイン設定

WordPress管理画面でOn-Demand Revalidationプラグインを有効化し、以下の設定を行います：

- Webhook URL: `https://your-domain.com/api/revalidate`
- Secret Token: 環境変数`REVALIDATE_SECRET`と同じ値
- トリガー: 投稿の公開/更新/削除時

## 課題

- WordPressプラグインの実装は別途必要です
- 本番環境での動作確認が必要です
- セキュリティトークンの管理方法を検討する必要があります（本番環境では環境変数で管理）

## 次のステップ

- フェーズ5.10（ブログページのISR対応）、フェーズ7.5（実績ページのISR対応）で各ページにISR設定を追加
- 本番環境での動作確認とパフォーマンステストの実施

