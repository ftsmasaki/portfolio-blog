import * as E from "fp-ts/Either";

/**
 * 複数のバリデーション結果を結合して、すべてが成功した場合のみ Right を返す
 */
export const combineValidations = <T>(
  validations: readonly E.Either<string, T>[]
): E.Either<string[], T[]> => {
  const failures: string[] = [];
  const successes: T[] = [];

  for (const validation of validations) {
    if (E.isLeft(validation)) {
      failures.push(validation.left);
    } else {
      successes.push(validation.right);
    }
  }

  return failures.length > 0 ? E.left(failures) : E.right(successes);
};

/**
 * 必須フィールドのバリデーション
 */
export const validateRequired = (value: unknown): E.Either<string, string> => {
  if (typeof value === "string" && value.length > 0) {
    return E.right(value);
  }
  return E.left("このフィールドは必須です");
};

/**
 * 最小長のバリデーション
 */
export const validateMinLength =
  (minLength: number) =>
  (value: string): E.Either<string, string> => {
    if (value.length >= minLength) {
      return E.right(value);
    }
    return E.left(`最小${minLength}文字以上である必要があります`);
  };

/**
 * 最大長のバリデーション
 */
export const validateMaxLength =
  (maxLength: number) =>
  (value: string): E.Either<string, string> => {
    if (value.length <= maxLength) {
      return E.right(value);
    }
    return E.left(`最大${maxLength}文字までです`);
  };

/**
 * URLのバリデーション
 */
export const validateUrl = (value: string): E.Either<string, string> => {
  try {
    new URL(value);
    return E.right(value);
  } catch {
    return E.left("有効なURLである必要があります");
  }
};

/**
 * 正の整数のバリデーション
 */
export const validatePositiveInteger = (
  value: unknown
): E.Either<string, number> => {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return E.right(value);
  }
  return E.left("正の整数である必要があります");
};

/**
 * 非負の整数のバリデーション
 */
export const validateNonNegativeInteger = (
  value: unknown
): E.Either<string, number> => {
  if (typeof value === "number" && Number.isInteger(value) && value >= 0) {
    return E.right(value);
  }
  return E.left("0以上の整数である必要があります");
};

/**
 * スラッグ形式のバリデーション（小文字英数字とハイフンのみ）
 */
export const validateSlug = (value: string): E.Either<string, string> => {
  if (/^[a-z0-9-]+$/.test(value)) {
    return E.right(value);
  }
  return E.left("小文字英数字とハイフンのみ使用可能です");
};

/**
 * 複数のバリデーション関数を順番に適用し、すべてが成功した場合のみ Right を返す
 */
export const pipeValidation =
  <T>(value: T) =>
  (
    ...validators: Array<(v: T) => E.Either<string, T>>
  ): E.Either<string[], T> => {
    for (const validator of validators) {
      const result = validator(value);
      if (E.isLeft(result)) {
        return E.left([result.left]);
      }
      value = result.right;
    }
    return E.right(value);
  };
