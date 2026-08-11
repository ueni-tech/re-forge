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
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  -
 *
 * 【契約】4問(正常時 / 困った入力 / しないこと / 暗黙の決め)への答え。型で表せないことだけ(任意)
 *  -
 *
 * @param sku - variationSkus の1行
 */
export function stateFromSku(sku: VariationSku): ComboState {
  throw new Error("not implemented");
}
