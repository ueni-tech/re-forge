export type VariationSku = {
  code: string;
  label: string;
  ballDiameter?: string;
  engravingLines?: string;
  saleStatus: number;
};

export function filterMatchedSkus(
  variationSkus: VariationSku[] | null | undefined,
  label: string | null,
  ballDiameter: string | null,
  engravingLines: string | null,
): VariationSku[] {
  const matched: VariationSku[] = [];
  if (!variationSkus) return matched;

  const filterByLabel = label != null;
  const filterByBallDiameter = ballDiameter != null;
  const filterByEngravingLines = engravingLines != null;

  variationSkus.forEach((row) => {
    if (filterByLabel) {
      if (!row.label || row.label !== label) return;
    }
    if (filterByBallDiameter) {
      if (!row.ballDiameter || row.ballDiameter !== ballDiameter) return;
    }
    if (filterByEngravingLines) {
      if (!row.engravingLines || row.engravingLines !== engravingLines) return;
    }
    matched.push(row);
  });

  return matched;
}

export function pickSaleStatusFromMatches(matched: VariationSku[]): string | undefined {
  if (matched.length === 0) return undefined;

  const IS_STOCK = 3;
  for (const row of matched) {
    const status = row.saleStatus ? row.saleStatus : 0;
    if (status === IS_STOCK) return String(IS_STOCK);
  }

  return matched[0].saleStatus ? String(matched[0].saleStatus) : "0";
}

export function aggregateSaleStatus(
  variationSkus: VariationSku[],
  label: string | null = null,
  ballDiameter: string | null = null,
  engravingLines: string | null = null,
): string | undefined {
  if (!variationSkus) return undefined;
  const matched = filterMatchedSkus(
    variationSkus,
    label,
    ballDiameter,
    engravingLines,
  );
  return pickSaleStatusFromMatches(matched);
}
