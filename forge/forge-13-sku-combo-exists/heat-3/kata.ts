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
 * （何のための関数か。1文。関数名の言い換えはしない）
 *
 * （別のやり方もできたが、こう決めたこと。無ければこの行は消す）
 */
export function collectDiametersForLabel(
  variationSkus: VariationSku[],
  label: string,
): string[] {
  throw new Error("not implemented");
}

/**
 * （何のための関数か。1文。関数名の言い換えはしない）
 *
 * （別のやり方もできたが、こう決めたこと。無ければこの行は消す）
 */
export function collectLinesForLabelDiameter(
  variationSkus: VariationSku[],
  label: string,
  ballDiameter: string | undefined,
): string[] {
  throw new Error("not implemented");
}
