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
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  -
 *
 * 【契約】4問への答え(任意)
 *  -
 *
 * @param state - 軸の選択状態
 * @param variationSkus - バリエーション SKU 一覧
 */
export function resolveSku(
  state: ComboState,
  variationSkus: VariationSku[],
): VariationSku | undefined {
  throw new Error("not implemented");
}
