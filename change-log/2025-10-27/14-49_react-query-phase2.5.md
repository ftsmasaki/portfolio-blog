# フェーズ2.5: React Query設定とQuery Keys定義

**実装日時**: 2025-10-27 14:49  
**フェーズ**: フェーズ2.5  
**実装計画書**: `docs/plans/2025-10-27_09-00_portfolio-blog/phase2.md`

---

## 1. 何を (What)

### 実装した機能
- React Queryクライアントの設定
- Query Keysの定義
- キャッシュ戦略の設定
- リトライ設定の実装

### 変更されたファイル
- **新規作成**: `app/src/infrastructure/query/client.ts` (17行)
- **新規作成**: `app/src/infrastructure/query/keys.ts` (44行)
- **新規作成**: `app/src/infrastructure/query/index.ts` (2行)

### 実装した主要機能

#### QueryClient設定
1. **staleTime**: 5分（データが古くなるまで）
2. **gcTime**: 10分（キャッシュ削除までの時間）
3. **retry**: 3回（エラー時のリトライ回数）
4. **refetchOnWindowFocus**: false（ウィンドウフォーカス時の自動再取得を無効化）

#### Query Keys階層構造
1. **posts**: ブログ記事のQuery Keys
   - all, lists, list, details, detail, search, byTag
2. **works**: 実績のQuery Keys
   - all, lists, list, details, detail
3. **tags**: タグのQuery Keys
   - all, lists, details, detail

---

## 2. どんな目的で (Why)

### 目的
- React Queryによるデータフェッチングの効率化
- キャッシュ戦略によるパフォーマンス向上
- Query Keysの一括管理による保守性向上
- 型安全なキャッシュ管理

### 解決した課題
- 手動でのキャッシュ管理の複雑さ
- データフェッチングのボイラープレート削減
- エラーハンドリングとリトライの統一

---

## 3. どう変更したか (How)

### 実装方法
- @tanstack/react-queryを使用
- QueryClientのデフォルト設定
- 階層構造でのQuery Keys管理
- constアサーションによる型安全性の確保

### 技術スタック
- **@tanstack/react-query**: データフェッチングとキャッシュ管理
- **TypeScript**: 型安全性の確保

### 重要なコード変更

#### 新規作成: `infrastructure/query/client.ts`

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分
      gcTime: 10 * 60 * 1000, // 10分
      retry: 3,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

#### 新規作成: `infrastructure/query/keys.ts`

```typescript
export const queryKeys = {
  posts: {
    all: ["posts"] as const,
    lists: () => [...queryKeys.posts.all, "list"] as const,
    list: (filters: string) => [...queryKeys.posts.lists(), { filters }] as const,
    details: () => [...queryKeys.posts.all, "detail"] as const,
    detail: (slug: string) => [...queryKeys.posts.details(), slug] as const,
    search: (query: string) =>
      [...queryKeys.posts.all, "search", query] as const,
    byTag: (tagSlug: string) =>
      [...queryKeys.posts.all, "tag", tagSlug] as const,
  },
  // ... works, tags
} as const;
```

---

## 4. 考えられる影響と範囲

### 既存機能への影響
- **影響なし**: 新規ファイルの作成のみで既存機能への影響なし
- 後続フェーズでアプリケーション層から使用される

### ユーザーエクスペリエンスへの影響
- データフェッチングのパフォーマンス向上
- キャッシュによる高速な表示
- ネットワークエラー時の自動リトライ

### パフォーマンスへの影響
- キャッシュによるネットワークリクエスト削減
- staleTimeとgcTimeによる最適なメモリ使用

---

## 5. 課題

### 今後の改善点
- レイヤーを跨いだデータ取得ロジックの実装（フェーズ3で実装予定）
- リアルタイム検索用の最適化
- ページネーション対応

### 未解決の問題
- なし

### 追加で必要な作業
- フェーズ2.6でエラーハンドリングとバリデーション実装
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

フェーズ2.5の完了条件:
- ✅ QueryClientが設定済み
- ✅ Query Keysが定義済み
- ✅ キャッシュ戦略が適切に設定
- ✅ 型チェックエラーが0件

**次フェーズ**: フェーズ2.6（エラーハンドリングとバリデーション実装）

---

## 動作確認のお願い

実装内容をご確認いただき、問題がなければ次のフェーズに進みます。

### 推奨コミットメッセージ
```
feat: [フェーズ2.5] React Query設定とQuery Keys定義

- QueryClientの設定（キャッシュ戦略、リトライ設定）
- Query Keysの階層構造定義
- ブログ記事・実績・タグのQuery Keys
- 型安全なキャッシュ管理
```

