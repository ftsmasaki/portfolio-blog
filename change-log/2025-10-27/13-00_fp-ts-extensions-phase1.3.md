# フェーズ1.3: fp-ts拡張機能の実装

## 何を (What)

フェーズ1.3の完了として、fp-tsの拡張機能を実装し、関数型プログラミングの基盤を整えました。

### 実装したファイル

1. **Either拡張機能** (`app/src/shared/fp-ts/either.ts`)
   - `isRight`, `isLeft`: Eitherの値がRightかLeftかを判定
   - `getOrElse`: Eitherから値を取得（Leftの場合はデフォルト値を返す）
   - `map`: Eitherをマップして値を変換
   - `flatMap`: Eitherをフラットマップ

2. **TaskEither拡張機能** (`app/src/shared/fp-ts/task-either.ts`)
   - `getOrElse`: TaskEitherから値を取得（Leftの場合はデフォルト値を返す）
   - `map`: TaskEitherをマップして値を変換
   - `flatMap`: TaskEitherをフラットマップ

3. **Option拡張機能** (`app/src/shared/fp-ts/option.ts`)
   - `isSome`, `isNone`: Optionの値がSomeかNoneかを判定
   - `getOrElse`: Optionから値を取得（Noneの場合はデフォルト値を返す）
   - `map`: Optionをマップして値を変換
   - `flatMap`: Optionをフラットマップ
   - `some`, `none`: SomeとNoneのコンストラクタ

4. **一括エクスポート** (`app/src/shared/fp-ts/index.ts`)
   - 名前空間によるエクスポートで名前の衝突を回避
   - 各拡張機能の関数にプレフィックスを付けて区別

## どんな目的で (Why)

このフェーズの目的は、fp-tsの拡張機能を実装し、関数型プログラミングの基盤を整えることでした。

具体的には：
- 関数型パターンを使いやすくするためのヘルパー関数の実装
- Either型の拡張：エラーハンドリング用
- TaskEither型の拡張：非同期処理のエラーハンドリング用
- Option型の拡張：null安全な値の取り扱い用
- 一括エクスポートによる使いやすさの向上

## どう変更したか (How)

### Either拡張機能の実装方針

Error Handling用のEither型に対して、使いやすさを向上させる拡張関数を実装しました。
エラー発生時のデフォルト値取得や値の変換を行うための関数を提供しています。

- `getOrElse`: EitherがLeft（エラー）の場合にデフォルト値を返す関数
- `map`: Either内のRight値を変換する関数（エラーはそのまま伝播）
- `flatMap`: Either内のRight値を別のEitherに変換する関数

### TaskEither拡張機能の実装方針

非同期処理でのError Handling用のTaskEither型に対して、Eitherと同様の拡張関数を実装しました。
特にAppError型に特化した実装で、一貫性のあるエラーハンドリングを提供します。

### Option拡張機能の実装方針

null安全な値の取り扱いのためのOption型に対して、値の存在確認や変換を行う拡張関数を実装しました。

- `isSome`, `isNone`: Optionの値が存在するかを判定する関数
- `getOrElse`: OptionがNoneの場合にデフォルト値を返す関数
- `map`: Option内のSome値を変換する関数（Noneはそのまま）
- `flatMap`: Option内のSome値を別のOptionに変換する関数
- `some`, `none`: Option値を生成するコンストラクタ関数

### 一括エクスポートの実装方針

各拡張機能を名前空間的なプレフィックス付きで一括エクスポートすることで、名前の衝突を防ぎながら使いやすさを向上させました。
具体的には、`getOrElseEither`, `getOrElseTaskEither`, `getOrElseOption`のように、各型に応じたプレフィックスを付けています。

## 考えられる影響と範囲

### 既存機能への影響

- 今回の変更は新規ファイルの作成のみで、既存のコードへの影響はありません
- fp-ts拡張機能の実装のみで、実行時の動作への影響はありません

### ユーザーエクスペリエンスへの影響

- 現時点では影響なし（基盤構築フェーズ）

### パフォーマンスへの影響

- 影響なし（ヘルパー関数のみの実装）

## 課題

現在の実装では以下の課題があります：

1. **型の厳密性**: 一部の関数で型の推論が完全ではない可能性があります
2. **使用例の不足**: 各拡張機能の使用例がまだ不足しています
3. **テストの未作成**: 拡張機能の動作確認のため、今後テストを作成する必要があります

## 次のステップ

フェーズ1.4: 値オブジェクト（ブログ・実績・タグ関連）の実装 に進みます。

