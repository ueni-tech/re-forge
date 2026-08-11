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
