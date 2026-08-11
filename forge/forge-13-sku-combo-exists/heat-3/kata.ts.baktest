export type VariationSku = {
  code: string;
  label: string;
  ballDiameter?: string;
  engravingLines?: string;
  saleStatus: number;
};

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
