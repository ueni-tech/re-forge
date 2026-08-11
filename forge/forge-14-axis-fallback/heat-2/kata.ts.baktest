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

export function applyAxisFallbacks(state: ComboState, variationSkus: VariationSku[]): void {
  if (state.ballDiameter !== undefined) {
    if (!hasDiameterForStateColor(state, variationSkus, state.ballDiameter)) {
      const next = pickMinAxisValue(collectDiametersForLabel(variationSkus, state.label));
      if (next !== undefined) state.ballDiameter = next;
    }
  }
  if (state.engravingLines !== undefined) {
    if (!hasLinesForStateColorDiameter(state, variationSkus, state.engravingLines)) {
      const next = pickMinAxisValue(
        collectLinesForLabelDiameter(variationSkus, state.label, state.ballDiameter),
      );
      if (next !== undefined) state.engravingLines = next;
    }
  }
}
