import { MAX_LENGTH_BY_CODE_AND_FONT } from "../fixtures/max_length";
import { hasJapaneseScript } from "../fixtures/validators-ref";
import type {
  FontName,
  MaxLengthByScript,
  UnverifiedValue,
  VariationClassificationCode,
} from "../fixtures/types";

export type { FontName, MaxLengthByScript, UnverifiedValue, VariationClassificationCode };

export function resolveMaxLengthByScript(
  code: VariationClassificationCode,
  font: FontName,
): MaxLengthByScript {
  const byCode = MAX_LENGTH_BY_CODE_AND_FONT[code];
  if (!(font in byCode)) {
    throw new Error("不正なバリエーション分類コードと書体の組み合わせです");
  }
  return byCode[font as keyof typeof byCode];
}

export function resolveEffectiveMaxLength(
  maxLengthByScript: MaxLengthByScript,
  value: UnverifiedValue,
): number {
  return hasJapaneseScript(value) ? maxLengthByScript.ja : maxLengthByScript.en;
}
