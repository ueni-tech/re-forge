// [heat-1] SKU 行からピッカー用の軸状態を作る
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

export type VariationSku = {
  code: string;
  label: string;
  ballDiameter?: string;
  engravingLines?: string;
  wrapping?: string;
  saleStatus: number;
};

export type ComboState = {
  label: string;
  ballDiameter?: string;
  engravingLines?: string;
  wrapping?: string;
};

/**
 * SKU の1行から、ピッカーが持つ選択状態を作る。
 *
 * 径・行数が空や未設定ならそのキーは付けない。wrapping は載せない。
 *
 * @param sku variationSkus の1行
 */
export function stateFromSku(sku: VariationSku): ComboState {
  const result: ComboState = { label: sku.label };
  if (sku.ballDiameter) result.ballDiameter = sku.ballDiameter;
  if (sku.engravingLines) result.engravingLines = sku.engravingLines;

  return result;
}
