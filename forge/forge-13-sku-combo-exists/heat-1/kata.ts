// [heat-1] 色 × ボール径の組み合わせ存在判定
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
 * （何のための関数か。1文。関数名の言い換えはしない）
 *
 * （別のやり方もできたが、こう決めたこと。無ければこの行は消す）
 */
export function hasDiameterForStateColor(
  state: ComboState,
  variationSkus: VariationSku[],
  ballDiameter: string | null,
): boolean {
  throw new Error("not implemented");
}
