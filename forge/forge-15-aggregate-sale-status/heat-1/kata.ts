// [heat-1] 部分指定で SKU 行をフィルタする
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
export function filterMatchedSkus(
  variationSkus: VariationSku[] | null | undefined,
  label: string | null,
  ballDiameter: string | null,
  engravingLines: string | null,
): VariationSku[] {
  throw new Error("not implemented");
}
