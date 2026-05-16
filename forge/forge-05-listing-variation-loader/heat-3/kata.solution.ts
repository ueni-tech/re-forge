// [heat-3] 解答(閲覧・比較用)

import type { VariationSku } from "../heat-1/kata.solution";
import {
  loadPageVariation,
  applyListingCodeParam,
  buildGoodsImageVariationsMap,
} from "./kata";

export type PrepareResult = {
  variationSkus: VariationSku[];
  defaultCode: string;
  variationsMap: Record<string, { path: string }>;
};

export function prepareVariation(
  rawData: unknown,
  pageKey: string,
  getParam: (name: string) => string | null,
  getBaseUrl: () => string,
): PrepareResult | null {
  const { variationSkus, defaultCode: initialCode } = loadPageVariation(
    rawData,
    pageKey,
  );

  if (variationSkus.length === 0) return null;

  const defaultCode = applyListingCodeParam(
    variationSkus,
    initialCode,
    getParam("listing-code"),
  );

  const variationsMap = buildGoodsImageVariationsMap(
    variationSkus,
    getBaseUrl(),
  );

  return { variationSkus, defaultCode, variationsMap };
}
