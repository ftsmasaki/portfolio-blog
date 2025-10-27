/**
 * fp-ts拡張機能の一括エクスポート
 */

// Either拡張機能
export {
  isRight,
  isLeft,
  getOrElse as getOrElseEither,
  map as mapEither,
  flatMap as flatMapEither,
} from "./either";

// TaskEither拡張機能
export {
  getOrElse as getOrElseTaskEither,
  map as mapTaskEither,
  flatMap as flatMapTaskEither,
} from "./task-either";

// Option拡張機能
export {
  isSome,
  isNone,
  getOrElse as getOrElseOption,
  map as mapOption,
  flatMap as flatMapOption,
  some,
  none,
} from "./option";
