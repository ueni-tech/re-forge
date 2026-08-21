// [heat-3] 名入れ検証入口とルールセット
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

import type { RuleStep, ValidationInput, ValidationResult } from "../fixtures/types";

export type { RuleStep, ValidationInput, ValidationResult, ValidationContext } from "../fixtures/types";

/**
 * 側面名入れの入力を RuleStep 列で検証する。
 */
export function validateSideName(
  input: ValidationInput,
  ruleSet?: RuleStep[],
): ValidationResult {
  throw new Error("not implemented");
}

/** data-validation-rule="engraving-text" 用ルールセット */
export const ENGRAVING_TEXT_RULE_SET: RuleStep[] = [];

/**
 * 属性値から RuleStep 列を解決する。
 */
export function resolveRuleSet(ruleName: string | undefined): RuleStep[] | undefined {
  throw new Error("not implemented");
}

/**
 * 登録済みルール名から input セレクタ文字列を組み立てる。
 */
export function validationRuleFieldSelector(): string {
  throw new Error("not implemented");
}
