// [heat-2] 解答(閲覧・比較用)

import type { VariationSku } from "../heat-1/kata.solution";

export function applyListingCodeParam(
  variationSkus: VariationSku[],
  defaultCode: string,
  requestedCode: string | null | undefined,
): string {
  if (!requestedCode) return defaultCode;
  const found = variationSkus.some((sku) => sku.code === requestedCode);
  return found ? requestedCode : defaultCode;
}

export function buildGoodsImageVariationsMap(
  variationSkus: VariationSku[],
  baseUrl: string,
): Record<string, { path: string }> {
  const map: Record<string, { path: string }> = {};
  for (const sku of variationSkus) {
    if (sku.code === "") continue;
    map[sku.code] = { path: baseUrl + sku.code + ".html" };
  }
  return map;
}
