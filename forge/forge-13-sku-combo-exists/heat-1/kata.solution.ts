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

export function hasDiameterForStateColor(
  state: ComboState,
  variationSkus: VariationSku[],
  ballDiameter: string | null,
): boolean {
  return variationSkus.some(
    (sku) => sku.label === state.label && sku.ballDiameter === ballDiameter,
  );
}
