// [heat-1] 名入れ文字の基本判定器
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

export type UnverifiedValue = string;

/**
 * 名入れ入力が未入力かどうかを判定する。
 */
export function isEmpty(value: UnverifiedValue): boolean {
  throw new Error("not implemented");
}

/**
 * 先頭または末尾に半角・全角スペースがあるかを判定する。
 */
export function hasLeadingOrTrailingSpace(value: UnverifiedValue): boolean {
  throw new Error("not implemented");
}

/**
 * 半角・全角を問わず連続したスペースがあるかを判定する。
 */
export function hasConsecutiveSpaces(value: UnverifiedValue): boolean {
  throw new Error("not implemented");
}

/**
 * 上限文字数を超えているかを判定する。
 */
export function isOverMaxLength(value: UnverifiedValue, maxLength: number): boolean {
  throw new Error("not implemented");
}
