// [heat-3] 名入れ検証の初期化・同期・Input 組み立て
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

import type { ValidationInput } from "../../forge-18-side-name-rule-pipeline/fixtures/types";
import type { CreateSideNameValidationOptions } from "../fixtures/types";

export type { CreateSideNameValidationOptions, ValidationInput };

export function createSideNameValidation(
  options: CreateSideNameValidationOptions,
): { init: () => void; syncValidationState: () => void } {
  throw new Error("not implemented");
}

/**
 * fixture 用: DOM から ValidationInput を組み立てる。
 */
export function buildValidationInput(inputEl: HTMLInputElement): ValidationInput | undefined {
  throw new Error("not implemented");
}
