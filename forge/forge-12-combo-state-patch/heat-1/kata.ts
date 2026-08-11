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
 *  - SKU テーブルの1行を、ピッカーが保持する ComboState に変換する。
 *
 * 【契約】4問(正常時 / 困った入力 / しないこと / 暗黙の決め)への答え。型で表せないことだけ(任意)
 *  - 正常時: label は必須。ballDiameter / engrabingLines は truthy ならコピー
 *  - 困った入力: 軸がない・空文字のときはそのプロパティを省略
 *  - しないこと: sku を変更しない。wrapping / saleStatus / code はコピーしない
 *  - 暗黙の決め: `if (sku.ballDiameter)` で truthy 判定。未設定軸はプロパティ省略。
 *  engravingLines: "0" のときは有効な値としてコピーする
 *
 * @param sku - variationSkus の1行
 */
export function stateFromSku(sku: VariationSku): ComboState {
  const result: ComboState = { label: sku.label };
  if (sku.ballDiameter) result.ballDiameter = sku.ballDiameter;
  if (sku.engravingLines) result.engravingLines = sku.engravingLines;

  return result;
}
