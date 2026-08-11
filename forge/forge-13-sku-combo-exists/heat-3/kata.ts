// [heat-3] SKU テーブルから軸候補値を収集する
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

/**
 * 【意図】
 *  -
 */
export function collectDiametersForLabel(
  variationSkus: VariationSku[],
  label: string,
): string[] {
  throw new Error("not implemented");
}

/**
 * 【意図】
 *  -
 */
export function collectLinesForLabelDiameter(
  variationSkus: VariationSku[],
  label: string,
  ballDiameter: string | undefined,
): string[] {
  throw new Error("not implemented");
}
