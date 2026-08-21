// [heat-3] 名入れ許可文字の判定器
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

import { ALLOWED_CHAR_CLASS, DENIED_CHARS } from "../fixtures/constants";

export type UnverifiedValue = string;

/**
 * 明示的に拒否された文字が含まれるかを判定する。
 */
export function hasDeniedCharacter(value: UnverifiedValue): boolean {
  throw new Error("not implemented");
}

/**
 * 許可文字集合外（拒否文字含む）の文字が含まれるかを判定する。
 */
export function hasDisallowedCharacter(value: UnverifiedValue): boolean {
  throw new Error("not implemented");
}
