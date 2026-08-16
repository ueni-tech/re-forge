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
 * ステータス集計の前段階として指定軸と一致するskuを集める
 */
export function filterMatchedSkus(
  variationSkus: VariationSku[] | null | undefined,
  label: string | null,
  ballDiameter: string | null,
  engravingLines: string | null,
): VariationSku[] {
  if (!variationSkus) return [];
  const matched: VariationSku[] = [];

  const filterByLabel = label != null;
  const filterByDiameter = ballDiameter != null;
  const filterLines = engravingLines != null;

  variationSkus.forEach((row) => {
    if (filterByLabel && (!row.label || row.label !== label)) return;
    if (filterByDiameter && (!row.ballDiameter || row.ballDiameter !== ballDiameter)) return;
    if (filterLines && (!row.engravingLines || row.engravingLines !== engravingLines)) return;
    matched.push(row);
  });
  return matched;
}
