import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";

/**
 * Option型の拡張機能
 */

/**
 * Optionの値がSomeかどうかを判定
 */
export const isSome = O.isSome;
export const isNone = O.isNone;

/**
 * Optionから値を取得（Noneの場合はデフォルト値を返す）
 */
export const getOrElse =
  <A>(defaultValue: A) =>
  (ma: O.Option<A>): A => {
    return pipe(
      ma,
      O.getOrElse(() => defaultValue)
    );
  };

/**
 * Optionをマップして値を変換
 */
export const map =
  <A, B>(f: (a: A) => B) =>
  (ma: O.Option<A>): O.Option<B> => {
    return pipe(ma, O.map(f));
  };

/**
 * Optionをフラットマップ
 */
export const flatMap =
  <A, B>(f: (a: A) => O.Option<B>) =>
  (ma: O.Option<A>): O.Option<B> => {
    return pipe(ma, O.flatMap(f));
  };

/**
 * 値からSomeを作成
 */
export const some = <A>(value: A): O.Option<A> => O.some(value);

/**
 * Noneを作成
 */
export const none = O.none;
