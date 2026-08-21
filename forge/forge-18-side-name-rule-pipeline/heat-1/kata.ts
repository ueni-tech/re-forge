// [heat-1] 名入れ上限の解決器
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

import type {
  FontName,
  MaxLengthByScript,
  UnverifiedValue,
  VariationClassificationCode,
} from "../fixtures/types";

export type { FontName, MaxLengthByScript, UnverifiedValue, VariationClassificationCode };

/**
 * 商品コードと書体から、和文・英文それぞれの上限文字数を返す。
 */
export function resolveMaxLengthByScript(
  code: VariationClassificationCode,
  font: FontName,
): MaxLengthByScript {
  throw new Error("not implemented");
}

/**
 * 入力内容に応じて、今回適用する上限文字数を返す。
 */
export function resolveEffectiveMaxLength(
  maxLengthByScript: MaxLengthByScript,
  value: UnverifiedValue,
): number {
  throw new Error("not implemented");
}
