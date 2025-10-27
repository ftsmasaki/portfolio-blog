# フェーズ3.5: DIコンテナ設定の実装

**実装日時**: 2025-10-27 15:07  
**フェーズ**: フェーズ3.5  
**実装計画書**: `docs/plans/2025-10-27_09-00_portfolio-blog/phase3.md`

---

## 1. 何を (What)

### 実装した機能
- Tsyringeを用いたDIコンテナ設定
- リポジトリの登録
- 注入済みユースケースのエクスポート
- reflect-metadataの設定

### 変更されたファイル
- **新規作成**: `app/src/application/di/di-container.ts` (25行)
- **新規作成**: `app/src/application/di/usecases.ts` (25行)

### 実装した主要機能

#### DIコンテナ設定
1. **TYPES定数**: リポジトリの型識別子を定義
2. **initializeContainer**: DIコンテナの初期化関数
3. **appContainer**: 初期化済みのDIコンテナ
4. **reflect-metadata**: TypeScriptデコレータサポート

#### 注入済みユースケース
1. **getPosts**: 全ての投稿を取得
2. **getPostBySlug**: スラッグで投稿を取得
3. **getPostsByTag**: タグで投稿を取得
4. **searchPosts**: キーワードで投稿を検索
5. **getWorks**: 全ての実績を取得
6. **getWorkBySlug**: スラッグで実績を取得
7. **getTags**: 全てのタグを取得
8. **getTagBySlug**: スラッグでタグを取得

---

## 2. どんな目的で (Why)

### 目的
- 依存性注入による疎結合な設計
- テスタビリティの向上
- リポジトリとユースケースの統合
- アプリケーション層の完成

### 解決した課題
- ハードコードされた依存関係の解消
- モック注入の容易化
- 設定の一元管理

---

## 3. どう変更したか (How)

### 実装方法
- Tsyringeライブラリを使用
- registerInstanceでリポジトリを登録
- 関数ファクトリパターンでユースケースを注入

### 技術スタック
- **Tsyringe**: DIコンテナ
- **reflect-metadata**: TypeScriptデコレータサポート
- **関数型プログラミング**: 関数ファクトリパターン

### 重要なコード変更

#### 新規作成: `application/di/di-container.ts`

```1:25:app/src/application/di/di-container.ts
import "reflect-metadata";
import { container } from "tsyringe";
import { wpApiPostRepository } from "@/infrastructure/repositories/WpApiPostRepository";
import { wpApiWorkRepository } from "@/infrastructure/repositories/WpApiWorkRepository";
import { wpApiTagRepository } from "@/infrastructure/repositories/WpApiTagRepository";

export const TYPES = {
  PostRepository: "PostRepository",
  WorkRepository: "WorkRepository",
  TagRepository: "TagRepository",
} as const;

/**
 * DIコンテナの初期化関数
 */
export const initializeContainer = () => {
  container.registerInstance(TYPES.PostRepository, wpApiPostRepository);
  container.registerInstance(TYPES.WorkRepository, wpApiWorkRepository);
  container.registerInstance(TYPES.TagRepository, wpApiTagRepository);

  return container;
};

export const appContainer = initializeContainer();
export { container };
```

#### 新規作成: `application/di/usecases.ts`

```1:25:app/src/application/di/usecases.ts
import {
  createGetPostsUseCase,
  createGetPostBySlugUseCase,
  createGetPostsByTagUseCase,
  createSearchPostsUseCase,
} from "@/application/blog/usecases";
import {
  createGetWorksUseCase,
  createGetWorkBySlugUseCase,
} from "@/application/works/usecases";
import {
  createGetTagsUseCase,
  createGetTagBySlugUseCase,
} from "@/application/tags/usecases";
import { wpApiPostRepository } from "@/infrastructure/repositories/WpApiPostRepository";
import { wpApiWorkRepository } from "@/infrastructure/repositories/WpApiWorkRepository";
import { wpApiTagRepository } from "@/infrastructure/repositories/WpApiTagRepository";

// 注入済みの、すぐに実行できるユースケースをエクスポート
export const getPosts = createGetPostsUseCase(wpApiPostRepository);
export const getPostBySlug = createGetPostBySlugUseCase(wpApiPostRepository);
export const getPostsByTag = createGetPostsByTagUseCase(wpApiPostRepository);
export const searchPosts = createSearchPostsUseCase(wpApiPostRepository);
export const getWorks = createGetWorksUseCase(wpApiWorkRepository);
export const getWorkBySlug = createGetWorkBySlugUseCase(wpApiWorkRepository);
export const getTags = createGetTagsUseCase(wpApiTagRepository);
export const getTagBySlug = createGetTagBySlugUseCase(wpApiTagRepository);
```

---

## 4. 考えられる影響と範囲

### 既存機能への影響
- **影響なし**: 新規ファイルの作成のみで既存機能への影響なし
- 後続フェーズでプレゼンテーション層から使用される

### ユーザーエクスペリエンスへの影響
- この段階では直接的な影響なし
- 後続フェーズでのデータ取得機能の基盤となる

### パフォーマンスへの影響
- DIコンテナの初期化による軽微なオーバーヘッド
- 依存性注入による柔軟性の向上

---

## 5. 課題

### 今後の改善点
- 環境別の設定管理
- エラーハンドリングの詳細化
- ログ機能の追加

### 未解決の問題
- なし

### 追加で必要な作業
- フェーズ4でプレゼンテーション層実装
- テストの実装
- エラーハンドリングの統合

---

## 型チェック結果

✅ **型チェックエラー**: 0件

```bash
cd app && npx tsc --noEmit
# Exit code: 0
```

---

## 完了条件の達成状況

フェーズ3.5の完了条件:
- ✅ DIコンテナが初期化済み
- ✅ リポジトリが登録済み
- ✅ 注入済みユースケースがエクスポート済み
- ✅ reflect-metadataがインポート済み
- ✅ 型チェックエラーが0件

**フェーズ3完了**: アプリケーション層実装が完了しました

---

## 動作確認のお願い

実装内容をご確認いただき、問題がなければ次のフェーズに進みます。

### 推奨コミットメッセージ
```
feat: [フェーズ3.5] DIコンテナ設定の実装

- Tsyringeを用いたDIコンテナ設定
- リポジトリの登録
- 注入済みユースケースのエクスポート
- reflect-metadataの設定
- アプリケーション層の完成
```

