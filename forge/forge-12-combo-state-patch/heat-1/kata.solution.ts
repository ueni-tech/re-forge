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

export function stateFromSku(sku: VariationSku): ComboState {
  const state: ComboState = { label: sku.label };
  if (sku.ballDiameter) state.ballDiameter = sku.ballDiameter;
  if (sku.engravingLines) state.engravingLines = sku.engravingLines;
  return state;
}
