// [heat-1] 名入れ 1入力分の検証ループ
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

import type { CreateSideNameValidationOptions } from "../fixtures/types";

export type { CreateSideNameValidationOptions };

/**
 * 名入れ input 群に検証・表示・結果集約を配線するファクトリ。
 */
export function createSideNameValidation(
  options: CreateSideNameValidationOptions,
): { init: () => void; syncValidationState: () => void } {
  throw new Error("not implemented");
}
