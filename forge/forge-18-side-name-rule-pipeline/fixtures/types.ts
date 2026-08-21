import { MAX_LENGTH_BY_CODE_AND_FONT } from "./max_length";

export type UnverifiedValue = string;

export type VariationClassificationCode = keyof typeof MAX_LENGTH_BY_CODE_AND_FONT;

export type FontName = {
  [C in VariationClassificationCode]: keyof (typeof MAX_LENGTH_BY_CODE_AND_FONT)[C];
}[VariationClassificationCode];

export type MaxLengthByScript = {
  readonly ja: number;
  readonly en: number;
};

export type ValidationInput = {
  value: string;
  code: VariationClassificationCode;
  font: FontName;
};

export type ValidationContext = {
  value: string;
  code: VariationClassificationCode;
  font: FontName;
  effectiveMaxLength: number;
  allowJapanese: boolean;
  hasJapaneseCapableFont: boolean;
};

export type RuleId =
  | "empty"
  | "leadingOrTrailingSpace"
  | "consecutiveSpaces"
  | "japaneseNotAllowedForFont"
  | "halfWidthKatakana"
  | "allowedCharWithFullwidthInput"
  | "disallowedCharacter"
  | "overMaxLength";

export type RuleStep = {
  id: RuleId;
  fails: (ctx: ValidationContext) => boolean;
  message: string | ((ctx: ValidationContext) => string);
};

export type ValidationResult = { ok: true } | { ok: false; ruleId: RuleId; message: string };
