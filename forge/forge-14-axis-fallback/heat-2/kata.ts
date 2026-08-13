// [heat-2] 無効な軸選択をカスケードでフォールバックする
//
// 仕様は problem.md を参照。
// 依存ヘルパーは実装済み。applyAxisFallbacks のみ実装すること。
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

// --- 以下、heat-2 では変更不要（依存ヘルパー） ---

function parseAxisSortValue(value: string): number {
  const n = parseFloat(value);
  return isNaN(n) ? Number.POSITIVE_INFINITY : n;
}

export function pickMinAxisValue(values: string[]): string | undefined {
  const unique: string[] = [];
  values.forEach((v) => {
    if (v && unique.indexOf(v) === -1) unique.push(v);
  });
  if (unique.length === 0) return undefined;
  unique.sort((a, b) => parseAxisSortValue(a) - parseAxisSortValue(b));
  return unique[0];
}

export function hasDiameterForStateColor(
  state: ComboState,
  variationSkus: VariationSku[],
  ballDiameter: string | null,
): boolean {
  return variationSkus.some(
    (sku) => sku.label === state.label && sku.ballDiameter === ballDiameter,
  );
}

export function hasLinesForStateColorDiameter(
  state: ComboState,
  variationSkus: VariationSku[],
  engravingLines: string | null,
): boolean {
  return variationSkus.some(
    (sku) =>
      sku.label === state.label &&
      (state.ballDiameter === undefined || sku.ballDiameter === state.ballDiameter) &&
      sku.engravingLines === engravingLines,
  );
}

export function collectDiametersForLabel(
  variationSkus: VariationSku[],
  label: string,
): string[] {
  const out: string[] = [];
  variationSkus.forEach((sku) => {
    if (sku.label === label && sku.ballDiameter) out.push(sku.ballDiameter);
  });
  return out;
}

export function collectLinesForLabelDiameter(
  variationSkus: VariationSku[],
  label: string,
  ballDiameter: string | undefined,
): string[] {
  const out: string[] = [];
  variationSkus.forEach((sku) => {
    if (sku.label !== label) return;
    if (sku.ballDiameter !== undefined && sku.ballDiameter !== ballDiameter) return;
    if (sku.engravingLines) out.push(sku.engravingLines);
  });
  return out;
}

// --- ここから実装対象 ---

/**
 * （何のための関数か。1文。関数名の言い換えはしない）
 *
 * （別のやり方もできたが、こう決めたこと。無ければこの行は消す）
 */
export function applyAxisFallbacks(state: ComboState, variationSkus: VariationSku[]): void {
  throw new Error("not implemented");
}
