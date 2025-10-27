# フェーズ2.1: HTTPクライアントの実装

**実装日時**: 2025-10-27 14:32  
**フェーズ**: フェーズ2.1  
**実装計画書**: `docs/plans/2025-10-27_09-00_portfolio-blog/phase2.md`

---

## 1. 何を (What)

### 実装した機能
- HTTPクライアントの実装（fetchラッパー）
- Either型によるエラーハンドリング
- GETリクエストのサポート
- POSTリクエストのサポート

### 変更されたファイル
- **新規作成**: `app/src/infrastructure/http/client.ts` (94行)

### 実装した主要機能
1. **HttpGetClient**: GETリクエストを送信する関数
2. **HttpPostClient**: POSTリクエストを送信する関数
3. **Either型エラーハンドリング**: 成功時はRight、失敗時はLeftを返す
4. **型安全性**: ジェネリクスを用いた型安全な実装

---

## 2. どんな目的で (Why)

### 目的
- WordPress REST APIとの安全な通信基盤の構築
- 関数型プログラミング（Either型）による型安全なエラーハンドリング
- 再利用可能なHTTPクライアントの提供

### 解決した課題
- fetch APIの直接使用による型安全性の欠如
- try-catchによる手動エラーハンドリングの回避
- 統一されたHTTPエラーの扱い

---

## 3. どう変更したか (How)

### 実装方法
- fp-tsのEither型を使用
- TaskEitherのtryCatchを利用
- fetch APIをラップして型安全に
- HttpResponse型とHttpError型を定義

### 技術スタック
- **fp-ts**: Either、TaskEither
- **fetch API**: ネイティブHTTP通信
- **TypeScript**: 型安全性の確保

### 重要なコード変更

#### 新規作成: `infrastructure/http/client.ts`

```typescript
export interface HttpResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

export interface HttpError {
  message: string;
  status: number;
  data?: unknown;
}

export const httpClient = {
  get: async <T>(
    url: string,
    options?: RequestInit
  ): Promise<E.Either<HttpError, HttpResponse<T>>> => {
    // Either型を返すHTTPクライアント
  },
  
  post: async <T>(
    url: string,
    body: unknown,
    options?: RequestInit
  ): Promise<E.Either<HttpError, HttpResponse<T>>> => {
    // Either型を返すHTTPクライアント
  },
};
```

---

## 4. 考えられる影響と範囲

### 既存機能への影響
- **影響なし**: 新規ファイルの作成のみで既存機能への影響なし
- 他層からの使用を想定した設計

### ユーザーエクスペリエンスへの影響
- この段階では直接的な影響なし
- 後続フェーズでのWordPress API連携の基盤となる

### パフォーマンスへの影響
- fetch APIを直接使用しているため、パフォーマンスへの影響なし

---

## 5. 課題

### 今後の改善点
- キャッシュ戦略の実装（次のフェーズで実装予定）
- リトライ機能の実装（必要に応じて）
- タイムアウト設定の追加

### 未解決の問題
- なし

### 追加で必要な作業
- フェーズ2.2でWordPress API連携機能の実装
- HTTPクライアントのテスト実装（フェーズ12で実装予定）

---

## 型チェック結果

✅ **型チェックエラー**: 0件

```bash
cd app && npx tsc --noEmit
# Exit code: 0
```

---

## 完了条件の達成状況

フェーズ2.1の完了条件:
- ✅ HTTPクライアントが実装済み
- ⏳ GETリクエストが正常に動作（動作確認待ち）
- ⏳ POSTリクエストが正常に動作（動作確認待ち）
- ✅ エラーハンドリングが適切に実装
- ✅ 型チェックエラーが0件

**次フェーズ**: フェーズ2.2（WordPress API連携の実装）

---

## 動作確認のお願い

実装内容をご確認いただき、問題がなければ次のフェーズに進みます。

### 推奨コミットメッセージ
```
feat: [フェーズ2.1] HTTPクライアントの実装

- fetchラッパーとしてHTTPクライアントを実装
- Either型による型安全なエラーハンドリング
- GET/POSTリクエストのサポート
- HttpResponse型とHttpError型の定義
```

