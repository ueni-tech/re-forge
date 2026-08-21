import {
  hasAllowedCharWithFullwidthInput,
  hasConsecutiveSpaces,
  hasDisallowedCharacter,
  hasHalfWidthKatakana,
  hasJapaneseScript,
  hasLeadingOrTrailingSpace,
  isEmpty,
  isOverMaxLength,
} from "../fixtures/validators-ref";
import { buildContext, runRules } from "../heat-2/kata.solution";
import type { RuleStep, ValidationContext, ValidationInput, ValidationResult } from "../fixtures/types";

export type { RuleStep, ValidationInput, ValidationResult, ValidationContext };

export const ENGRAVING_TEXT_RULE_SET: RuleStep[] = [
  {
    id: "empty",
    fails: (ctx) => isEmpty(ctx.value),
    message: "名入れ内容を入力してください",
  },
  {
    id: "leadingOrTrailingSpace",
    fails: (ctx) => hasLeadingOrTrailingSpace(ctx.value),
    message: "先頭または末尾にスペースは使用できません",
  },
  {
    id: "consecutiveSpaces",
    fails: (ctx) => hasConsecutiveSpaces(ctx.value),
    message: "スペースを2つ以上連続して入力することはできません",
  },
  {
    id: "japaneseNotAllowedForFont",
    fails: (ctx) =>
      !ctx.allowJapanese && (hasJapaneseScript(ctx.value) || hasHalfWidthKatakana(ctx.value)),
    message: (ctx) =>
      ctx.hasJapaneseCapableFont
        ? "選択中の書体では英数字・記号のみご利用いただけます。日本語を入力する場合は書体を変更してください"
        : "英数字・記号のみご利用いただけます",
  },
  {
    id: "halfWidthKatakana",
    fails: (ctx) => hasHalfWidthKatakana(ctx.value),
    message: "半角カタカナは使用できません。全角カタカナでご入力ください",
  },
  {
    id: "allowedCharWithFullwidthInput",
    fails: (ctx) => hasAllowedCharWithFullwidthInput(ctx.value),
    message: "英数字・記号は半角でご入力ください",
  },
  {
    id: "disallowedCharacter",
    fails: (ctx) => hasDisallowedCharacter(ctx.value),
    message: "使用できない文字が含まれています。使用可能な文字・記号をご確認ください",
  },
  {
    id: "overMaxLength",
    fails: (ctx) => isOverMaxLength(ctx.value, ctx.effectiveMaxLength),
    message: (ctx) => `${ctx.effectiveMaxLength}文字以内でご入力ください`,
  },
];

export const RULE_SET_BY_VALIDATION_RULE = {
  "engraving-text": ENGRAVING_TEXT_RULE_SET,
} as const;

export type ValidationRuleName = keyof typeof RULE_SET_BY_VALIDATION_RULE;

export function validateSideName(
  input: ValidationInput,
  ruleSet: RuleStep[] = ENGRAVING_TEXT_RULE_SET,
): ValidationResult {
  return runRules(buildContext(input), ruleSet);
}

export function resolveRuleSet(ruleName: string | undefined): RuleStep[] | undefined {
  if (!ruleName || !(ruleName in RULE_SET_BY_VALIDATION_RULE)) return;
  return RULE_SET_BY_VALIDATION_RULE[ruleName as ValidationRuleName];
}

export function validationRuleFieldSelector(): string {
  return (Object.keys(RULE_SET_BY_VALIDATION_RULE) as ValidationRuleName[])
    .map((rule) => `[data-validation-rule="${rule}"]`)
    .join(", ");
}
