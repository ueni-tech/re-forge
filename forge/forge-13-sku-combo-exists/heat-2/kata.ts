// [heat-2] 色 × 径 × 行数の組み合わせ存在判定
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

export type VariationSku = {
  code: string;
  label: string;
  ballDiameter?: string;
  engravingLines?: string;
  saleStatus: number;
};

export type ComboState = {
  label: string;
  ballDiameter?: string;
  engravingLines?: string;
};

/**
 * 【意図】
 *  -
 *
 * 【契約】
 *  -
 */
export function hasLinesForStateColorDiameter(
  state: ComboState,
  variationSkus: VariationSku[],
  engravingLines: string | null,
): boolean {
  throw new Error("not implemented");
}
