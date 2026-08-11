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
