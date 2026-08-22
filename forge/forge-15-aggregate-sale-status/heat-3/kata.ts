// [heat-3] aggregateSaleStatus — フィルタと集約の合成
//
// 仕様は problem.md を参照。
// heat-1/2 の関数をこのファイルに含めてよい（推奨: 再利用）。
// 行き詰まったら kata.solution.ts を参照。
import { filterMatchedSkus } from "../heat-1/kata";
import { pickSaleStatusFromMatches } from "../heat-2/kata";

export type VariationSku = {
  code: string;
  label: string;
  ballDiameter?: string;
  engravingLines?: string;
  saleStatus: number;
};

/**
 * 軸の指定から各軸のピッカーの販売ステータスを決める
 * 指定しない軸には null を渡す
 */
export function aggregateSaleStatus(
  variationSkus: VariationSku[],
  label: string | null = null,
  ballDiameter: string | null = null,
  engravingLines: string | null = null,
): string | undefined {
  const matches = filterMatchedSkus(variationSkus, label, ballDiameter, engravingLines);
  const saleStatus = pickSaleStatusFromMatches(matches);
  return saleStatus;
}
