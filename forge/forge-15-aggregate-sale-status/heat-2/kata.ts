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
 * 【意図】
 *  -
 *
 * 【契約】
 *  -
 */
export function pickSaleStatusFromMatches(matched: VariationSku[]): string | undefined {
  throw new Error("not implemented");
}
