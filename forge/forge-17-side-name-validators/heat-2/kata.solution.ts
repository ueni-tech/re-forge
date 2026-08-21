import {
  ALLOWED_CHAR_WITH_FULLWIDTH_INPUT_CHAR_CLASS,
  HALFWIDTH_KATAKANA,
  JAPANESE_SCRIPT_CHAR_CLASS,
} from "../fixtures/constants";

export type UnverifiedValue = string;

export function hasJapaneseScript(value: UnverifiedValue): boolean {
  return new RegExp(`[${JAPANESE_SCRIPT_CHAR_CLASS}]`, "u").test(value);
}

export function hasHalfWidthKatakana(value: UnverifiedValue): boolean {
  return new RegExp(`[${HALFWIDTH_KATAKANA}]`, "u").test(value);
}

export function hasAllowedCharWithFullwidthInput(value: UnverifiedValue): boolean {
  return new RegExp(`[${ALLOWED_CHAR_WITH_FULLWIDTH_INPUT_CHAR_CLASS}]`, "u").test(value);
}
