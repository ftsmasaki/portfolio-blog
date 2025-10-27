import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

/**
 * Either型の拡張機能
 */

/**
 * Eitherの値がRightかどうかを判定
 */
export const isRight = E.isRight;
export const isLeft = E.isLeft;

/**
 * Eitherから値を取得（Leftの場合はデフォルト値を返す）
 */
export const getOrElse =
  <A>(defaultValue: A) =>
  <B>(ma: E.Either<B, A>): A => {
    return pipe(
      ma,
      E.getOrElse(() => defaultValue)
    );
  };

/**
 * Eitherをマップして値を変換
 */
export const map =
  <A, B>(f: (a: A) => B) =>
  <E>(ma: E.Either<E, A>): E.Either<E, B> => {
    return E.map(f)(ma);
  };

/**
 * Eitherをフラットマップ
 */
export const flatMap =
  <A, B>(f: (a: A) => E.Either<unknown, B>) =>
  <E>(ma: E.Either<E, A>): E.Either<E | unknown, B> => {
    return E.flatMap(f)(ma);
  };
