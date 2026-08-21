// [heat-2] 名入れ入力イベント配線
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

import type { CreateSideNameValidationOptions } from "../fixtures/types";

export type { CreateSideNameValidationOptions };

export function createSideNameValidation(
  options: CreateSideNameValidationOptions,
): { init: () => void; syncValidationState: () => void } {
  throw new Error("not implemented");
}
