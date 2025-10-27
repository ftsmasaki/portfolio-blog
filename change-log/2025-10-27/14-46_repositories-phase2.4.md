# フェーズ2.4: リポジトリ（ブログ・実績・タグ）の実装

**実装日時**: 2025-10-27 14:46  
**フェーズ**: フェーズ2.4  
**実装計画書**: `docs/plans/2025-10-27_09-00_portfolio-blog/phase2.md`

---

## 1. 何を (What)

### 実装した機能
- WordPress APIを利用したリポジトリ実装
- ブログリポジトリの実装
- 実績リポジトリの実装
- タグリポジトリの実装
- TaskEitherによるエラーハンドリング
- データマッパーとの統合

### 変更されたファイル
- **新規作成**: `app/src/infrastructure/repositories/WpApiPostRepository.ts` (121行)
- **新規作成**: `app/src/infrastructure/repositories/WpApiWorkRepository.ts` (101行)
- **新規作成**: `app/src/infrastructure/repositories/WpApiTagRepository.ts` (104行)

### 実装した主要機能

#### ブログリポジトリ
1. **findAll**: 全ての投稿を取得
2. **findBySlug**: スラッグで投稿を取得
3. **findByTagSlug**: タグスラッグで投稿を取得
4. **search**: キーワードで投稿を検索

#### 実績リポジトリ
1. **findAll**: 全ての実績を取得
2. **findBySlug**: スラッグで実績を取得

#### タグリポジトリ
1. **findAll**: 全てのタグを取得
2. **findBySlug**: スラッグでタグを取得

---

## 2. どんな目的で (Why)

### 目的
- WordPress APIを利用したデータ取得機能の実装
- ドメイン層とインフラ層の分離
- 統一されたエラーハンドリング
- TaskEitherによる非同期処理の型安全性

### 解決した課題
- WordPress APIの直接使用による責任の混在
- エラーハンドリングの統一
- データマッピングとAPI呼び出しの統合

---

## 3. どう変更したか (How)

### 実装方法
- fp-tsのTaskEither型を使用
- ドメイン層のポートインターフェースを実装
- データマッパーを使用したWordPress API → ドメインモデル変換
- 環境変数からのWordPress URL取得

### 技術スタック
- **fp-ts**: TaskEither、Either、pipe
- **ドメイン層**: PostRepository、WorkRepository、TagRepository
- **アプリケーション層**: AppError
- **インフラ層**: WordPress API、データマッパー

### 重要なコード変更

#### 新規作成: `infrastructure/repositories/WpApiPostRepository.ts`

```typescript
export const wpApiPostRepository: PostRepository = {
  findAll: (): TE.TaskEither<AppError, Post[]> => {
    return pipe(
      TE.tryCatch(
        async () => {
          const baseUrl = process.env.WORDPRESS_URL || "";
          const result = await getWordPressPosts(baseUrl);
          
          if (E.isLeft(result)) {
            throw new Error(`Failed to fetch posts: ${result.left.message}`);
          }
          
          return result.right;
        },
        (error): AppError => ({
          _tag: "NetworkError",
          error: error instanceof Error ? error : new Error("Unknown error"),
        })
      ),
      TE.chain((wpPosts) =>
        pipe(
          mapWordPressPostsToDomain(wpPosts),
          TE.fromEither,
          TE.mapLeft(
            (error): AppError => ({
              _tag: "ValidationError",
              field: "posts",
              message: error.message,
            })
          )
        )
      )
    );
  },
  // ... 他のメソッド
};
```

---

## 4. 考えられる影響と範囲

### 既存機能への影響
- **影響なし**: 新規ファイルの作成のみで既存機能への影響なし
- 後続フェーズでDIコンテナから使用される

### ユーザーエクスペリエンスへの影響
- この段階では直接的な影響なし
- 後続フェーズでのデータ取得機能の基盤となる

### パフォーマンスへの影響
- WordPress APIへのHTTPリクエストによるネットワーク遅延
- TaskEitherによる非同期処理のオーバーヘッドは最小限

---

## 5. 課題

### 今後の改善点
- キャッシュ戦略の実装（フェーズ2.5で実装予定）
- ページネーション対応
- エラーメッセージの詳細化

### 未解決の問題
- なし

### 追加で必要な作業
- フェーズ2.5でReact Query設定とQuery Keys定義
- フェーズ3でDIコンテナ設定
- テスト実装（フェーズ12で実装予定）

---

## 型チェック結果

✅ **型チェックエラー**: 0件

```bash
cd app && npx tsc --noEmit
# Exit code: 0
```

---

## 完了条件の達成状況

フェーズ2.4の完了条件:
- ✅ ブログリポジトリが実装済み
- ✅ 実績リポジトリが実装済み
- ✅ タグリポジトリが実装済み
- ✅ 型チェックエラーが0件

**次フェーズ**: フェーズ2.5（React Query設定とQuery Keys定義）

---

## 動作確認のお願い

実装内容をご確認いただき、問題がなければ次のフェーズに進みます。

### 推奨コミットメッセージ
```
feat: [フェーズ2.4] リポジトリ（ブログ・実績・タグ）の実装

- WordPress APIを利用したブログリポジトリの実装
- WordPress APIを利用した実績リポジトリの実装
- WordPress APIを利用したタグリポジトリの実装
- TaskEitherによるエラーハンドリング
- データマッパーとの統合
- ドメイン層との分離
```

