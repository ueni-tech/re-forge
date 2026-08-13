// [heat-3] aggregateSaleStatus — フィルタと集約の合成
//
// 仕様は problem.md を参照。
// heat-1/2 の関数をこのファイルに含めてよい（推奨: 再利用）。
// 行き詰まったら kata.solution.ts を参照。

export type VariationSku = {
  code: string;
  label: string;
  ballDiameter?: string;
  engravingLines?: string;
  saleStatus: number;
};

// heat-1/2 をここに実装するか、下記スタブを置き換える
export function filterMatchedSkus(
  variationSkus: VariationSku[] | null | undefined,
  label: string | null,
  ballDiameter: string | null,
  engravingLines: string | null,
): VariationSku[] {
  throw new Error("not implemented");
}

export function pickSaleStatusFromMatches(matched: VariationSku[]): string | undefined {
  throw new Error("not implemented");
}

/**
 * （何のための関数か。1文。関数名の言い換えはしない）
 *
 * （別のやり方もできたが、こう決めたこと。無ければこの行は消す）
 */
export function aggregateSaleStatus(
  variationSkus: VariationSku[],
  label: string | null = null,
  ballDiameter: string | null = null,
  engravingLines: string | null = null,
): string | undefined {
  throw new Error("not implemented");
}
