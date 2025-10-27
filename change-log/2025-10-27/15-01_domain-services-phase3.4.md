# フェーズ3.4: ドメインサービスの実装

**実装日時**: 2025-10-27 15:01  
**フェーズ**: フェーズ3.4  
**実装計画書**: `docs/plans/2025-10-27_09-00_portfolio-blog/phase3.md`

---

## 1. 何を (What)

### 実装した機能
- 関連記事抽出機能（純粋関数）
- 関連実績抽出機能（純粋関数）

### 変更されたファイル
- **新規作成**: `app/src/application/services.ts` (58行)

### 実装した主要機能

#### 関連記事抽出機能
1. **extractRelatedPosts**: 同じタグを持つ記事を最大5件まで抽出
   - 同じタグIDを持つ記事をフィルタリング
   - 対象記事自体は除外
   - 最大件数を制限

#### 関連実績抽出機能
1. **extractRelatedWorks**: 同じ技術スタックを持つ実績を最大3件まで抽出
   - 同じ技術を持つ実績をフィルタリング
   - 大文字小文字を区別しない比較
   - 対象実績自体は除外
   - 最大件数を制限

---

## 2. どんな目的で (Why)

### 目的
- 複数のエンティティにまたがるビジネスロジックの実装
- 純粋関数による実装
- 再利用可能なサービス関数の提供

### 解決した課題
- 関連コンテンツの自動抽出機能
- ビジネスロジックの分離
- テスタビリティの向上

---

## 3. どう変更したか (How)

### 実装方法
- 純粋関数として実装
- fp-tsのpipeとArrayモジュールを使用
- 関数型プログラミングパラダイムの採用

### 技術スタック
- **fp-ts**: pipe、Arrayモジュール
- **TypeScript**: 型安全な実装
- **関数型プログラミング**: 純粋関数による実装

### 重要なコード変更

#### 新規作成: `application/services.ts`

```1:58:app/src/application/services.ts
import { pipe } from "fp-ts/function";
import * as A from "fp-ts/Array";
import type { Post } from "@/domain/blog/entities";
import type { Work } from "@/domain/works/entities";

/**
 * 記事の関連記事を抽出する
 * - 同じタグを持つ記事を最大5件まで抽出
 *
 * @param targetPost - 対象の記事
 * @param allPosts - 全ての記事
 * @param maxCount - 最大取得件数（デフォルト: 5）
 * @returns 関連記事の配列
 */
export const extractRelatedPosts = (
  targetPost: Post,
  allPosts: Post[],
  maxCount: number = 5
): Post[] => {
  return pipe(
    allPosts,
    A.filter((post) => post.id !== targetPost.id),
    A.filter((post) => {
      const targetTags = targetPost.tags.map((t) => t.id);
      const postTags = post.tags.map((t) => t.id);
      return targetTags.some((tag) => postTags.includes(tag));
    }),
    A.takeLeft(maxCount)
  );
};

/**
 * 関連する実績を抽出する
 * - 同じ技術スタックを持つ実績を最大3件まで抽出
 *
 * @param targetWork - 対象の実績
 * @param allWorks - 全ての実績
 * @param maxCount - 最大取得件数（デフォルト: 3）
 * @returns 関連実績の配列
 */
export const extractRelatedWorks = (
  targetWork: Work,
  allWorks: Work[],
  maxCount: number = 3
): Work[] => {
  return pipe(
    allWorks,
    A.filter((work) => work.id !== targetWork.id),
    A.filter((work) => {
      const targetTechs = targetWork.technologies.map((t) => t.value.toLowerCase());
      const workTechs = work.technologies.map((t) => t.value.toLowerCase());
      return targetTechs.some((tech) => workTechs.includes(tech));
    }),
    A.takeLeft(maxCount)
  );
};
```

### 技術的な注意点
- **Technology値オブジェクト**: Technology型は値オブジェクトのため、`.value`プロパティを使用して文字列にアクセス
- **不変性の保持**: 全ての関数は純粋関数として実装し、副作用を持たない

---

## 4. 考えられる影響と範囲

### 既存機能への影響
- **影響なし**: 新規ファイルの作成のみで既存機能への影響なし
- 後続フェーズで記事詳細・実績詳細ページで使用される

### ユーザーエクスペリエンスへの影響
- この段階では直接的な影響なし
- 後続フェーズでの関連コンテンツ表示機能の基盤となる

### パフォーマンスへの影響
- 配列フィルタリングによる軽微なオーバーヘッド
- 純粋関数による副作用なしで安全

---

## 5. 課題

### 今後の改善点
- アルゴリズムの最適化（大量データの場合）
- 関連度スコアの実装
- カスタマイズ可能な抽出条件

### 未解決の問題
- なし

### 追加で必要な作業
- フェーズ3.5でDIコンテナ設定
- 後続フェーズでUI統合
- テストの実装

---

## 型チェック結果

✅ **型チェックエラー**: 0件

```bash
cd app && npx tsc --noEmit
# Exit code: 0
```

---

## 完了条件の達成状況

フェーズ3.4の完了条件:
- ✅ 関連記事抽出機能が実装済み
- ✅ 関連実績抽出機能が実装済み
- ✅ 純粋関数として実装済み
- ✅ 型チェックエラーが0件

**次フェーズ**: フェーズ3.5（DIコンテナ設定）

---

## 動作確認のお願い

実装内容をご確認いただき、問題がなければ次のフェーズに進みます。

### 推奨コミットメッセージ
```
feat: [フェーズ3.4] ドメインサービスの実装

- 関連記事抽出機能の実装
- 関連実績抽出機能の実装
- 純粋関数による実装
- fp-tsを使用した関数型プログラミング
- 型安全性の確保
```

