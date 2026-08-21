import { MAX_LENGTH_BY_CODE_AND_FONT } from "../fixtures/max_length";
import { resolveEffectiveMaxLength, resolveMaxLengthByScript } from "../fixtures/resolve-ref";
import type {
  RuleStep,
  ValidationContext,
  ValidationInput,
  ValidationResult,
} from "../fixtures/types";

export type { RuleStep, ValidationContext, ValidationInput, ValidationResult };

function resolveHasJapaneseCapableFont(code: ValidationInput["code"]): boolean {
  return Object.values(MAX_LENGTH_BY_CODE_AND_FONT[code]).some((m) => m.ja > 0);
}

export function buildContext(input: ValidationInput): ValidationContext {
  const maxLengthByScript = resolveMaxLengthByScript(input.code, input.font);
  const effectiveMaxLength = resolveEffectiveMaxLength(maxLengthByScript, input.value);

  return {
    value: input.value,
    code: input.code,
    font: input.font,
    effectiveMaxLength,
    allowJapanese: maxLengthByScript.ja > 0,
    hasJapaneseCapableFont: resolveHasJapaneseCapableFont(input.code),
  };
}

export function runRules(ctx: ValidationContext, ruleSet: RuleStep[]): ValidationResult {
  for (const ruleStep of ruleSet) {
    if (ruleStep.fails(ctx)) {
      let message = ruleStep.message;
      if (typeof message === "function") {
        message = message(ctx);
      }
      return { ok: false, ruleId: ruleStep.id, message };
    }
  }
  return { ok: true };
}
