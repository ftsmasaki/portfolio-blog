# フェーズ1.2: ディレクトリ構成と型定義作成

## 何を (What)

フェーズ1.2の完了として、bulletproof-react準拠のディレクトリ構成と基本的な型定義を実装しました。

### 実装したファイル

1. **ページルート定数** (`app/src/shared/constants/routes.ts`)
   - ブログページルート定数
   - 実績ページルート定数
   - タグページルート定数
   - 共通ページルート定数
   - APIルート定数

2. **アプリケーションエラー型** (`app/src/application/common/errors.ts`)
   - NetworkError, ApiError, NotFoundError, ValidationError, UnknownErrorの型定義
   - AppError型（エラーのユニオン型）
   - エラーコンストラクタ関数の実装

3. **ドメインエンティティ** 
   - ブログエンティティ (`app/src/domain/blog/entities.ts`): Post, Author型定義
   - 実績エンティティ (`app/src/domain/works/entities.ts`): Work型定義
   - タグエンティティ (`app/src/domain/tags/entities.ts`): Tag型定義

4. **ドメインポート** (`app/src/domain/blog/ports.ts`)
   - PostRepository型定義
   - 依存性の逆転パターンを実装

## どんな目的で (Why)

このフェーズの目的は、bulletproof-react準拠のディレクトリ構成と基本的な型定義を作成し、関数型ドメインモデリングの基盤を整えることでした。

具体的には：
- 型安全なルート定義の実装
- ドメインエンティティの型定義
- アプリケーション全体のエラー型の定義
- クリーンアーキテクチャに基づくポート定義

## どう変更したか (How)

### 1. ページルート定数の実装

`app/src/shared/constants/routes.ts` に以下の定数を定義：

```typescript
export const BLOG_ROUTES = {
  INDEX: '/blog',
  POST: (slug: string) => `/blog/${slug}`,
  SEARCH: (query?: string) => query ? `/blog/search?q=${query}` : '/blog/search',
  TAG: (slug: string) => `/tags/${slug}`,
} as const;
```

型安全なルート定義と、パラメータ付きルートの生成関数を提供します。

### 2. アプリケーションエラー型の実装

`app/src/application/common/errors.ts` に以下のエラー型を定義：

- `NetworkError`: ネットワークエラー
- `ApiError`: APIエラー（ステータスコードとメッセージ）
- `NotFoundError`: リソース未找到エラー
- `ValidationError`: バリデーションエラー
- `UnknownError`: 不明なエラー

各エラー型にはタグ (`_tag`) を付与し、ユニオン型として `AppError` を定義。関数型プログラミングのパターンに従っています。

### 3. ドメインエンティティの実装

各ドメインモジュール（blog, works, tags）にエンティティを定義：

- `Post`: ブログ投稿エンティティ
- `Work`: 実績エンティティ
- `Tag`: タグエンティティ
- `Author`: 著者エンティティ

### 4. ドメインポートの実装

`app/src/domain/blog/ports.ts` に `PostRepository` 型を定義：

```typescript
export type PostRepository = {
  findAll: () => TaskEither<AppError, Post[]>;
  findBySlug: (slug: string) => TaskEither<AppError, Post>;
  findByTagSlug: (slug: string) => TaskEither<AppError, Post[]>;
  search: (query: string) => TaskEither<AppError, Post[]>;
};
```

依存性の逆転パターンを実装し、ドメイン層がインフラ層に依存しない設計を実現しました。

## 考えられる影響と範囲

### 既存機能への影響

- 今回の変更は新規ファイルの作成のみで、既存のコードへの影響はありません
- 型定義のみの実装のため、実行時の動作への影響はありません

### ユーザーエクスペリエンスへの影響

- 現時点では影響なし（基盤構築フェーズ）

### パフォーマンスへの影響

- 影響なし（型定義のみの実装）

## 課題

現在の実装では以下の課題があります：

1. **値オブジェクトの未実装**: 現在のエンティティはプリミティブ型を使用していますが、フェーズ1.4で値オブジェクトを実装する予定です
2. **他のポートの未実装**: 現在は `PostRepository` のみ実装していますが、今後 `WorkRepository` や `TagRepository` も実装する必要があります
3. **テストの未作成**: 型定義のみの実装のため、テストの作成は省略しました

## 次のステップ

フェーズ1.3: fp-ts拡張機能の実装 に進みます。

