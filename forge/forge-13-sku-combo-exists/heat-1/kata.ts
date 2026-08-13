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
 * 径ボタンをhiddenにするため、選択中の色とその組み合わせが sku にあるか調べる
 *
 * 判定する径は state ではなく第3引数。各径ボタンの値をループで渡す。
 */
export function hasDiameterForStateColor(
  state: ComboState,
  variationSkus: VariationSku[],
  ballDiameter: string | null,
): boolean {
  return variationSkus.some(
    (sku) => sku.label === state.label && sku.ballDiameter === ballDiameter,
  );
}
