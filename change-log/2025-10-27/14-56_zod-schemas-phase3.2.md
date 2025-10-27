# フェーズ3.2: Zodスキーマ定義（ブログ・実績・タグ）の実装

**実装日時**: 2025-10-27 14:56  
**フェーズ**: フェーズ3.2  
**実装計画書**: `docs/plans/2025-10-27_09-00_portfolio-blog/phase3.md`

---

## 1. 何を (What)

### 実装した機能
- WordPress APIレスポンス用ブログスキーマの実装
- WordPress APIレスポンス用実績スキーマの実装
- WordPress APIレスポンス用タグスキーマの実装
- WordPressエラーレスポンススキーマの実装
- Zodスキーマによる型安全性の確保

### 変更されたファイル
- **新規作成**: `app/src/application/blog/schemas.ts` (27行)
- **新規作成**: `app/src/application/works/schemas.ts` (17行)
- **新規作成**: `app/src/application/tags/schemas.ts` (13行)

### 実装した主要機能

#### ブログスキーマ
1. **WordPressPostSchema**: WordPress APIレスポンス用ブログスキーマ
2. **WordPressErrorSchema**: WordPress APIエラーレスポンススキーマ
3. **WordPressPost型**: Zodスキーマから推論された型
4. **WordPressError型**: Zodスキーマから推論された型

#### 実績スキーマ
1. **WordPressWorkSchema**: WordPress APIレスポンス用実績スキーマ
2. **WordPressWork型**: Zodスキーマから推論された型

#### タグスキーマ
1. **WordPressTagSchema**: WordPress APIレスポンス用タグスキーマ
2. **WordPressTag型**: Zodスキーマから推論された型

---

## 2. どんな目的で (Why)

### 目的
- WordPress APIレスポンスの型安全性の確保
- Zodによるスキーマバリデーションの実装
- ランタイム型チェックの実現
- アプリケーション層でのデータ検証

### 解決した課題
- APIレスポンスの型安全性の確保
- 不正なデータの早期検出
- ランタイムでのデータ検証

---

## 3. どう変更したか (How)

### 実装方法
- Zodライブラリを使用したスキーマ定義
- WordPress APIレスポンスの型に基づいたスキーマ設計
- 既存のinfrastructure層の型との統合

### 技術スタック
- **Zod**: スキーマ定義とバリデーション
- **TypeScript**: 型推論と型安全性

### 重要なコード変更

#### 新規作成: `application/blog/schemas.ts`

```1:27:app/src/application/blog/schemas.ts
import { z } from 'zod';

/**
 * WordPress APIレスポンス用ブログスキーマ
 */
export const WordPressPostSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({ rendered: z.string() }),
  content: z.object({ rendered: z.string() }),
  excerpt: z.object({ rendered: z.string() }),
  date: z.string(),
  modified: z.string(),
  featured_media: z.number().optional(),
  tags: z.array(z.number()).optional(),
  _embedded: z.object({
    'wp:featuredmedia': z.array(z.object({ source_url: z.string() })).optional(),
  }).optional(),
});

/**
 * WordPress APIレスポンス型
 */
export type WordPressPost = z.infer<typeof WordPressPostSchema>;

/**
 * WordPressエラーレスポンススキーマ
 */
export const WordPressErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  data: z.object({
    status: z.number(),
  }),
});

/**
 * WordPressエラーレスポンス型
 */
export type WordPressError = z.infer<typeof WordPressErrorSchema>;
```

#### 新規作成: `application/works/schemas.ts`

```1:17:app/src/application/works/schemas.ts
import { z } from 'zod';

/**
 * WordPress APIレスポンス用実績スキーマ
 * 実績もWordPressのカスタム投稿タイプ「works」を使用するため、WordPressPostと同じ構造
 */
export const WordPressWorkSchema = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.object({ rendered: z.string() }),
  content: z.object({ rendered: z.string() }),
  excerpt: z.object({ rendered: z.string() }),
  date: z.string(),
  modified: z.string(),
  featured_media: z.number().optional(),
  tags: z.array(z.number()).optional(),
  _embedded: z.object({
    'wp:featuredmedia': z.array(z.object({ source_url: z.string() })).optional(),
  }).optional(),
});

/**
 * WordPress APIレスポンス型
 */
export type WordPressWork = z.infer<typeof WordPressWorkSchema>;
```

#### 新規作成: `application/tags/schemas.ts`

```1:13:app/src/application/tags/schemas.ts
import { z } from 'zod';

/**
 * WordPress APIレスポンス用タグスキーマ
 */
export const WordPressTagSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  taxonomy: z.string(),
  count: z.number(),
});

/**
 * WordPress APIレスポンス型
 */
export type WordPressTag = z.infer<typeof WordPressTagSchema>;
```

---

## 4. 考えられる影響と範囲

### 既存機能への影響
- **影響なし**: 新規ファイルの作成のみで既存機能への影響なし
- 後続フェーズでバリデーション関数として使用される

### ユーザーエクスペリエンスへの影響
- この段階では直接的な影響なし
- 後続フェーズでのデータ検証機能の基盤となる

### パフォーマンスへの影響
- Zodスキーマの定義のみで、パフォーマンスへの影響なし
- ランタイムでのバリデーション実行時に軽微なオーバーヘッドが発生（後続フェーズで実装）

---

## 5. 課題

### 今後の改善点
- スキーマの共通化（WordPressPostとWordPressWorkは同じ構造）
- カスタムバリデーションルールの追加
- エラーメッセージの詳細化

### 未解決の問題
- なし

### 追加で必要な作業
- フェーズ3.3でユースケース実装
- フェーズ3.4でドメインサービス実装
- フェーズ3.5でDIコンテナ設定
- バリデーション関数の実装（validators.ts）

---

## 型チェック結果

✅ **型チェックエラー**: 0件

```bash
cd app && npx tsc --noEmit
# Exit code: 0
```

---

## 完了条件の達成状況

フェーズ3.2の完了条件:
- ✅ ブログスキーマが定義済み
- ✅ 実績スキーマが定義済み
- ✅ タグスキーマが定義済み
- ✅ 型チェックエラーが0件

**次フェーズ**: フェーズ3.3（ユースケース実装）

---

## 動作確認のお願い

実装内容をご確認いただき、問題がなければ次のフェーズに進みます。

### 推奨コミットメッセージ
```
feat: [フェーズ3.2] Zodスキーマ定義（ブログ・実績・タグ）の実装

- WordPress APIレスポンス用ブログスキーマの実装
- WordPress APIレスポンス用実績スキーマの実装
- WordPress APIレスポンス用タグスキーマの実装
- WordPressエラーレスポンススキーマの実装
- 型安全なスキーマ定義
```

