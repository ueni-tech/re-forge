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
 * 行数ボタンを hidden するため、選択中の色、径と行数の組み合わせが sku にあるか調べる
 *
 * 判定する行数は state ではなく第3引数。行数ボタンの値をループして渡される想定。
 */
export function hasLinesForStateColorDiameter(
  state: ComboState,
  variationSkus: VariationSku[],
  engravingLines: string | null,
): boolean {
  return variationSkus.some((sku) => {
    if (state.label !== sku.label) return false;
    if (state.ballDiameter !== undefined && state.ballDiameter !== sku.ballDiameter) return false;
    if (engravingLines !== sku.engravingLines) return false;
    return true;
  });
}
