import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import type { AppError } from "@/application/common/errors";

/**
 * TaskEither型の拡張機能
 */

/**
 * TaskEitherから値を取得（Leftの場合はデフォルト値を返す）
 */
export const getOrElse =
  <A>(defaultValue: A) =>
  (ma: TE.TaskEither<AppError, A>) =>
    pipe(
      ma,
      TE.getOrElse(() => async () => defaultValue)
    );

/**
 * TaskEitherをマップして値を変換
 */
export const map =
  <A, B>(f: (a: A) => B) =>
  (ma: TE.TaskEither<AppError, A>) => {
    return pipe(ma, TE.map(f));
  };

/**
 * TaskEitherをフラットマップ
 */
export const flatMap =
  <A, B>(f: (a: A) => TE.TaskEither<AppError, B>) =>
  (ma: TE.TaskEither<AppError, A>) => {
    return pipe(ma, TE.flatMap(f));
  };
