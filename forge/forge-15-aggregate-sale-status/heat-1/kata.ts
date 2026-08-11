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
 * 【意図】
 *  -
 *
 * 【契約】
 *  -
 */
export function filterMatchedSkus(
  variationSkus: VariationSku[] | null | undefined,
  label: string | null,
  ballDiameter: string | null,
  engravingLines: string | null,
): VariationSku[] {
  throw new Error("not implemented");
}
