// [heat-2] 名入れ文字種の判定器
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

import {
  ALLOWED_CHAR_WITH_FULLWIDTH_INPUT_CHAR_CLASS,
  HALFWIDTH_KATAKANA,
  JAPANESE_SCRIPT_CHAR_CLASS,
} from "../fixtures/constants";

export type UnverifiedValue = string;

/**
 * ひらがな・全角カタカナ・漢字相当が含まれるかを判定する。
 */
export function hasJapaneseScript(value: UnverifiedValue): boolean {
  throw new Error("not implemented");
}

/**
 * 半角カタカナ（｡｢｣､･ を除く）が含まれるかを判定する。
 */
export function hasHalfWidthKatakana(value: UnverifiedValue): boolean {
  throw new Error("not implemented");
}

/**
 * 半角入力を強制する対象文字が全角で入力されているかを判定する。
 */
export function hasAllowedCharWithFullwidthInput(value: UnverifiedValue): boolean {
  throw new Error("not implemented");
}
