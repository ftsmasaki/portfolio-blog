# フェーズ2.2: WordPress API連携の実装

**実装日時**: 2025-10-27 14:38  
**フェーズ**: フェーズ2.2  
**実装計画書**: `docs/plans/2025-10-27_09-00_portfolio-blog/phase2.md`

---

## 1. 何を (What)

### 実装した機能
- WordPress REST API連携機能の実装
- 記事データ取得関数（一覧・スラッグ検索）
- 実績データ取得関数（一覧・スラッグ検索）
- タグデータ取得関数（一覧・スラッグ検索）
- WordPress APIレスポンス型定義
- Either型によるエラーハンドリング

### 変更されたファイル
- **新規作成**: `app/src/infrastructure/external/types.ts` (48行)
- **新規作成**: `app/src/infrastructure/external/wordpress-api.ts` (196行)

### 実装した主要機能
1. **getWordPressPosts**: 記事一覧を取得
2. **getWordPressPostBySlug**: スラッグで記事を取得
3. **getWordPressWorks**: 実績一覧を取得
4. **getWordPressWorkBySlug**: スラッグで実績を取得
5. **getWordPressTags**: タグ一覧を取得
6. **getWordPressTagBySlug**: スラッグでタグを取得
7. **WordPress APIレスポンス型定義**: WordPress APIレスポンスの型安全性確保

---

## 2. どんな目的で (Why)

### 目的
- WordPress REST APIとの連携基盤の構築
- 関数型プログラミング（Either型）による型安全なエラーハンドリング
- 再利用可能なWordPress APIクライアントの提供

### 解決した課題
- WordPress REST APIの直接使用による型安全性の欠如
- try-catchによる手動エラーハンドリングの回避
- 統一されたWordPress APIエラーの扱い

---

## 3. どう変更したか (How)

### 実装方法
- fp-tsのEither型を使用
- HttpResponse型からdataを抽出して型安全に処理
- WordPress APIの一般的なエンドポイントを使用
- _embedパラメータで埋め込みデータ（アイキャッチ画像・タグなど）を取得

### 技術スタック
- **fp-ts**: Either、pipe
- **HTTPクライアント**: フェーズ2.1で実装したhttpClientを使用
- **TypeScript**: 型安全性の確保

### 重要なコード変更

#### 新規作成: `infrastructure/external/types.ts`

```typescript
export interface WordPressPost {
  readonly id: number;
  readonly slug: string;
  readonly title: { readonly rendered: string };
  readonly content: { readonly rendered: string };
  readonly date: string;
  readonly modified: string;
  readonly _embedded?: {
    readonly "wp:featuredmedia"?: Array<{
      readonly source_url: string;
    }>;
    readonly "wp:term"?: Array<Array<{
      readonly id: number;
      readonly name: string;
      readonly slug: string;
    }>>;
  };
}

export interface WordPressTag {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly count: number;
}
```

#### 新規作成: `infrastructure/external/wordpress-api.ts`

```typescript
export const getWordPressPosts = async (
  baseUrl: string,
  page: number = 1,
  perPage: number = 10
): Promise<E.Either<WordPressApiError, WordPressPost[]>> => {
  const url = `${baseUrl}/wp-json/wp/v2/posts?page=${page}&per_page=${perPage}&_embed=true`;

  return pipe(
    await httpClient.get<WordPressPost[]>(url),
    E.map((response) => response.data),
    E.mapLeft((httpError: HttpError): WordPressApiError => ({
      message: httpError.message,
      status: httpError.status,
    }))
  );
};
```

---

## 4. 考えられる影響と範囲

### 既存機能への影響
- **影響なし**: 新規ファイルの作成のみで既存機能への影響なし
- 後続フェーズでリポジトリ・データマッパーから使用される

### ユーザーエクスペリエンスへの影響
- この段階では直接的な影響なし
- 後続フェーズでの記事・実績・タグ表示機能の基盤となる

### パフォーマンスへの影響
- HTTPクライアントを使用しているため、パフォーマンスへの影響は最小限
- _embedパラメータにより、関連データを1リクエストで取得可能

---

## 5. 課題

### 今後の改善点
- フェーズ3でZodバリデーションスキーマを実装予定
- フェーズ2.3でデータマッパーによるWordPress形式からドメインモデルへの変換を実装予定
- フェーズ2.4でリポジトリによるアプリケーション層との統合を実装予定

### 未解決の問題
- なし

### 追加で必要な作業
- フェーズ2.3でWordPress → ドメインモデルの変換マッパー実装
- フェーズ2.4でリポジトリ実装
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

フェーズ2.2の完了条件:
- ✅ WordPress APIクライアントが実装済み
- ⏳ 記事取得関数が正常に動作（動作確認待ち）
- ⏳ 実績取得関数が正常に動作（動作確認待ち）
- ⏳ タグ取得関数が正常に動作（動作確認待ち）
- ✅ 型チェックエラーが0件

**次フェーズ**: フェーズ2.3（データマッパーの実装）

---

## 動作確認のお願い

実装内容をご確認いただき、問題がなければ次のフェーズに進みます。

### 推奨コミットメッセージ
```
feat: [フェーズ2.2] WordPress API連携の実装

- WordPress APIレスポンス型定義の追加
- 記事データ取得関数の実装
- 実績データ取得関数の実装
- タグデータ取得関数の実装
- Either型によるエラーハンドリング
- _embedパラメータによる関連データ取得
```

