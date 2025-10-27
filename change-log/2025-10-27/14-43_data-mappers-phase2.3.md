# フェーズ2.3: データマッパーの実装

**実装日時**: 2025-10-27 14:43  
**フェーズ**: フェーズ2.3  
**実装計画書**: `docs/plans/2025-10-27_09-00_portfolio-blog/phase2.md`

---

## 1. 何を (What)

### 実装した機能
- WordPress REST APIレスポンスをドメインエンティティに変換するマッパーの実装
- WordPress → Post変換
- WordPress → Work変換
- WordPress → Tag変換
- 値オブジェクトによるバリデーション
- Either型によるエラーハンドリング

### 変更されたファイル
- **新規作成**: `app/src/infrastructure/mappers/wp-to-post.ts` (110行)
- **新規作成**: `app/src/infrastructure/mappers/wp-to-work.ts` (90行)
- **新規作成**: `app/src/infrastructure/mappers/wp-to-tag.ts` (48行)
- **更新**: `app/src/infrastructure/external/types.ts` (countプロパティの追加)

### 実装した主要機能
1. **mapWordPressPostToDomain**: WordPress記事をPostエンティティに変換
2. **mapWordPressPostsToDomain**: WordPress記事配列をPostエンティティ配列に変換
3. **mapWordPressWorkToDomain**: WordPress実績をWorkエンティティに変換
4. **mapWordPressWorksToDomain**: WordPress実績配列をWorkエンティティ配列に変換
5. **mapWordPressTagToDomain**: WordPressタグをTagエンティティに変換
6. **mapWordPressTagsToDomain**: WordPressタグ配列をTagエンティティ配列に変換

---

## 2. どんな目的で (Why)

### 目的
- WordPress APIレスポンスをドメインエンティティに安全に変換
- 値オブジェクトによる型安全性の確保
- 関数型プログラミング（Either型）によるエラーハンドリング
- WordPress APIの形式からドメインモデルへの分離

### 解決した課題
- WordPress APIレスポンスの直接使用による型安全性の欠如
- バリデーションロジックの集約
- エラーハンドリングの統一

---

## 3. どう変更したか (How)

### 実装方法
- fp-tsのEither型を使用
- 値オブジェクトのコンストラクタ関数を使用
- E.Doによるメソッドチェーン記法
- HTMLタグの除去処理
- _embeddedデータからの関連データ抽出

### 技術スタック
- **fp-ts**: Either、Do、pipe
- **値オブジェクト**: ドメイン層の値オブジェクトを使用
- **TypeScript**: 型安全性の確保

### 重要なコード変更

#### 新規作成: `infrastructure/mappers/wp-to-post.ts`

```typescript
export const mapWordPressPostToDomain = (
  wpPost: WordPressPost
): E.Either<Error, Post> => {
  return pipe(
    E.Do,
    E.bind("id", () => pipe(createPostId(wpPost.id), E.mapLeft((e) => new Error(e)))),
    E.bind("title", () =>
      pipe(
        createPostTitle(
          wpPost.title.rendered.replace(/<[^>]+>/g, "").trim()
        ),
        E.mapLeft((e) => new Error(e))
      )
    ),
    // ... 他のフィールド
    E.map(({ id, title, slug, excerpt, createdAt, updatedAt }) => {
      // タグと画像のマッピング
      const tags = wpTerms
        .map((term) => {
          const idResult = createTagId(term.id);
          const nameResult = createTagName(term.name);
          const slugResult = createTagSlug(term.slug);
          
          if (E.isRight(idResult) && E.isRight(nameResult) && E.isRight(slugResult)) {
            return {
              id: idResult.right,
              name: nameResult.right,
              slug: slugResult.right,
              count: { _tag: "TagCount" as const, value: term.count || 0 },
            };
          }
          return null;
        })
        .filter((tag): tag is NonNullable<typeof tag> => tag !== null);

      return {
        id,
        title,
        slug,
        excerpt,
        content: wpPost.content.rendered,
        createdAt,
        updatedAt,
        featuredImage,
        tags,
      };
    })
  );
};
```

#### 更新: `infrastructure/external/types.ts`

```typescript
readonly "wp:term"?: Array<
  Array<{
    readonly id: number;
    readonly name: string;
    readonly slug: string;
    readonly taxonomy: string;
    readonly count?: number; // 追加
  }>
>;
```

---

## 4. 考えられる影響と範囲

### 既存機能への影響
- **影響なし**: 新規ファイルの作成のみで既存機能への影響なし
- 後続フェーズでリポジトリから使用される

### ユーザーエクスペリエンスへの影響
- この段階では直接的な影響なし
- 後続フェーズでのWordPress APIデータ表示機能の基盤となる

### パフォーマンスへの影響
- 値オブジェクトのバリデーション処理による軽微なオーバーヘッド
- HTMLタグ除去処理による軽微なオーバーヘッド

---

## 5. 課題

### 今後の改善点
- カスタムフィールド（technologies、githubUrl、liveUrlなど）の取得
- 画像の複数枚対応
- より詳細なエラーメッセージ

### 未解決の問題
- なし

### 追加で必要な作業
- フェーズ2.4でリポジトリ実装
- カスタムフィールドの実装（必要に応じて）
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

フェーズ2.3の完了条件:
- ✅ WordPress → Postマッパーが実装済み
- ✅ WordPress → Workマッパーが実装済み
- ✅ WordPress → Tagマッパーが実装済み
- ✅ バリデーションが適切に実装
- ✅ 型チェックエラーが0件

**次フェーズ**: フェーズ2.4（リポジトリ（ブログ、事績、タグ）の実装）

---

## 動作確認のお願い

実装内容をご確認いただき、問題がなければ次のフェーズに進みます。

### 推奨コミットメッセージ
```
feat: [フェーズ2.3] データマッパーの実装

- WordPress → Post変換マッパーの実装
- WordPress → Work変換マッパーの実装
- WordPress → Tag変換マッパーの実装
- 値オブジェクトによるバリデーション
- Either型によるエラーハンドリング
- HTMLタグ除去処理の実装
- _embeddedデータからの抽出処理
```

