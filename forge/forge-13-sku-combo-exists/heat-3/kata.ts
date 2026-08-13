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
 * フォールバック先の径を決定するために選択中の色の行の径を集める
 */
export function collectDiametersForLabel(variationSkus: VariationSku[], label: string): string[] {
  const matched: string[] = [];
  variationSkus.forEach((sku) => {
    if (sku.label === label && sku.ballDiameter) {
      matched.push(sku.ballDiameter);
    }
  });
  return matched;
}

/**
 * フォールバック先の行数を決定するために指定中の色と径の組み合わせに一致する行の行数を集める
 */
export function collectLinesForLabelDiameter(
  variationSkus: VariationSku[],
  label: string,
  ballDiameter: string | undefined,
): string[] {
  const matched: string[] = [];
  variationSkus.forEach((sku) => {
    if (sku.label !== label) return;
    if (sku.ballDiameter !== undefined && sku.ballDiameter !== ballDiameter) return;
    if (!sku.engravingLines) return;
    matched.push(sku.engravingLines);
  });
  return matched;
}
