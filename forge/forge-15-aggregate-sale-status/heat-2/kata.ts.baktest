export type VariationSku = {
  code: string;
  label: string;
  ballDiameter?: string;
  engravingLines?: string;
  saleStatus: number;
};

export function pickSaleStatusFromMatches(matched: VariationSku[]): string | undefined {
  if (matched.length === 0) return undefined;

  const IS_STOCK = 3;
  for (const row of matched) {
    const status = row.saleStatus ? row.saleStatus : 0;
    if (status === IS_STOCK) return String(IS_STOCK);
  }

  return matched[0].saleStatus ? String(matched[0].saleStatus) : "0";
}
