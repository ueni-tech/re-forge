// [heat-2] 名入れ検証 Context とルール実行器
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

import type {
  RuleStep,
  ValidationContext,
  ValidationInput,
  ValidationResult,
} from "../fixtures/types";

export type { RuleStep, ValidationContext, ValidationInput, ValidationResult };

/**
 * 検証入力から RuleStep が参照する Context を組み立てる。
 */
export function buildContext(input: ValidationInput): ValidationContext {
  throw new Error("not implemented");
}

/**
 * RuleStep 列を先頭失敗で評価する。
 */
export function runRules(ctx: ValidationContext, ruleSet: RuleStep[]): ValidationResult {
  throw new Error("not implemented");
}
