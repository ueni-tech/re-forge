// [heat-2] マッチ行から代表販売ステータスを選ぶ
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
 * フィルタ後の SKU から、ピッカーボタンに付ける代表販売ステータスを1つ決める
 * 在庫(3)が1つでもあれば "3"。なければ先頭行のステータスにフォールバック。
 * 先頭行がfalsy なら "0"。
 */
export function pickSaleStatusFromMatches(matched: VariationSku[]): string | undefined {
  const IN_STOCK = 3;
  if (!matched.length) return undefined;
  const isStock = matched.some((row) => row.saleStatus === IN_STOCK);
  if (isStock) return String(IN_STOCK);
  return matched[0].saleStatus ? String(matched[0].saleStatus) : "0";
}
