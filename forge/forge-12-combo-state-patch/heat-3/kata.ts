// [heat-3] 軸状態から SKU 行を確定する
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
 * ピッカーの軸状態から listingCode に渡す sku 行を1つ確定する
 *
 * 値が undefined の軸では絞らない。複数一致は先頭。無効組み合わせの補正はしない。
 *
 * @param state 軸の選択状態
 * @param variationSkus バリエーション SKU 一覧
 */
export function resolveSku(
  state: ComboState,
  variationSkus: VariationSku[],
): VariationSku | undefined {
  return variationSkus.find((sku) => {
    if (state.label !== sku.label) {
      return false;
    }
    if (state.ballDiameter !== undefined && state.ballDiameter !== sku.ballDiameter) {
      return false;
    }
    if (state.engravingLines !== undefined && state.engravingLines !== sku.engravingLines) {
      return false;
    }
    if (state.wrapping !== undefined && state.wrapping !== sku.wrapping) {
      return false;
    }
    return true;
  });
}
