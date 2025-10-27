# フェーズ3.3: ユースケース（ブログ・実績・タグ）の実装

**実装日時**: 2025-10-27 14:59  
**フェーズ**: フェーズ3.3  
**実装計画書**: `docs/plans/2025-10-27_09-00_portfolio-blog/phase3.md`

---

## 1. 何を (What)

### 実装した機能
- ブログユースケース（関数ファクトリパターン）
- 実績ユースケース（関数ファクトリパターン）
- タグユースケース（関数ファクトリパターン）

### 変更されたファイル
- **新規作成**: `app/src/application/blog/usecases.ts` (30行)
- **新規作成**: `app/src/application/works/usecases.ts` (19行)
- **新規作成**: `app/src/application/tags/usecases.ts` (19行)

### 実装した主要機能

#### ブログユースケース
1. **createGetPostsUseCase**: 全ての投稿を取得するユースケースを作成
2. **createGetPostBySlugUseCase**: スラッグで投稿を取得するユースケースを作成
3. **createGetPostsByTagUseCase**: タグスラッグで投稿を取得するユースケースを作成
4. **createSearchPostsUseCase**: キーワードで投稿を検索するユースケースを作成

#### 実績ユースケース
1. **createGetWorksUseCase**: 全ての実績を取得するユースケースを作成
2. **createGetWorkBySlugUseCase**: スラッグで実績を取得するユースケースを作成

#### タグユースケース
1. **createGetTagsUseCase**: 全てのタグを取得するユースケースを作成
2. **createGetTagBySlugUseCase**: スラッグでタグを取得するユースケースを作成

---

## 2. どんな目的で (Why)

### 目的
- リポジトリを利用したユースケースの実装
- 関数ファクトリパターンによるDI実装
- アプリケーション層とドメイン層の分離
- テスタビリティの向上

### 解決した課題
- リポジトリとの緊密な結合の回避
- テスト時のモック注入の容易化
- 依存関係の明示的な管理

---

## 3. どう変更したか (How)

### 実装方法
- 関数ファクトリパターンを使用
- リポジトリを引数として受け取り、ユースケース関数を返す
- 型安全性を確保

### 技術スタック
- **fp-ts**: TaskEither型を使用したエラーハンドリング
- **TypeScript**: 型安全な実装
- **関数型プログラミング**: 関数ファクトリパターン

### 重要なコード変更

#### 新規作成: `application/blog/usecases.ts`

```1:30:app/src/application/blog/usecases.ts
import type { PostRepository } from '@/domain/blog/ports';

/**
 * ブログユースケースの関数ファクトリ
 */

/**
 * 全ての投稿を取得するユースケースを作成
 */
export const createGetPostsUseCase = (repo: PostRepository) => repo.findAll;

/**
 * スラッグで投稿を取得するユースケースを作成
 */
export const createGetPostBySlugUseCase = (repo: PostRepository) => repo.findBySlug;

/**
 * タグスラッグで投稿を取得するユースケースを作成
 */
export const createGetPostsByTagUseCase = (repo: PostRepository) => repo.findByTagSlug;

/**
 * キーワードで投稿を検索するユースケースを作成
 */
export const createSearchPostsUseCase = (repo: PostRepository) => repo.search;
```

#### 新規作成: `application/works/usecases.ts`

```1:19:app/src/application/works/usecases.ts
import type { WorkRepository } from '@/domain/works/ports';

/**
 * 実績ユースケースの関数ファクトリ
 */

/**
 * 全ての実績を取得するユースケースを作成
 */
export const createGetWorksUseCase = (repo: WorkRepository) => repo.findAll;

/**
 * スラッグで実績を取得するユースケースを作成
 */
export const createGetWorkBySlugUseCase = (repo: WorkRepository) => repo.findBySlug;
```

#### 新規作成: `application/tags/usecases.ts`

```1:19:app/src/application/tags/usecases.ts
import type { TagRepository } from '@/domain/tags/ports';

/**
 * タグユースケースの関数ファクトリ
 */

/**
 * 全てのタグを取得するユースケースを作成
 */
export const createGetTagsUseCase = (repo: TagRepository) => repo.findAll;

/**
 * スラッグでタグを取得するユースケースを作成
 */
export const createGetTagBySlugUseCase = (repo: TagRepository) => repo.findBySlug;
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
- 関数ファクトリパターンによる軽微なオーバーヘッドのみ

---

## 5. 課題

### 今後の改善点
- ユースケースのロジック追加（必要に応じて）
- エラーハンドリングの詳細化
- テストの実装

### 未解決の問題
- なし

### 追加で必要な作業
- フェーズ3.4でドメインサービス実装
- フェーズ3.5でDIコンテナ設定
- 後続フェーズでユースケースの使用

---

## 型チェック結果

✅ **型チェックエラー**: 0件

```bash
cd app && npx tsc --noEmit
# Exit code: 0
```

---

## 完了条件の達成状況

フェーズ3.3の完了条件:
- ✅ ブログユースケースが実装済み
- ✅ 実績ユースケースが実装済み
- ✅ タグユースケースが実装済み
- ✅ 型チェックエラーが0件

**次フェーズ**: フェーズ3.4（ドメインサービスの実装）

---

## 動作確認のお願い

実装内容をご確認いただき、問題がなければ次のフェーズに進みます。

### 推奨コミットメッセージ
```
feat: [フェーズ3.3] ユースケース（ブログ・実績・タグ）の実装

- ブログユースケースの関数ファクトリ実装
- 実績ユースケースの関数ファクトリ実装
- タグユースケースの関数ファクトリ実装
- 依存性注入による疎結合な設計
- 型安全性の確保
```

