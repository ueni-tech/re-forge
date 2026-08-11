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

export function resolveSku(
  state: ComboState,
  variationSkus: VariationSku[],
): VariationSku | undefined {
  return variationSkus.find((sku) => {
    if (sku.label !== state.label) return false;
    if (state.ballDiameter !== undefined && sku.ballDiameter !== state.ballDiameter) {
      return false;
    }
    if (state.engravingLines !== undefined && sku.engravingLines !== state.engravingLines) {
      return false;
    }
    if (state.wrapping !== undefined && sku.wrapping !== state.wrapping) return false;
    return true;
  });
}
