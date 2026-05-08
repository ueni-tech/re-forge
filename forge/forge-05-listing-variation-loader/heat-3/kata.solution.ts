// [heat-3] 解答（閲覧・比較用）

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
  _rawData: unknown,
  _pageKey: string,
  _getParam: (name: string) => string | null,
  _getBaseUrl: () => string,
): PrepareResult | null {
  const { variationSkus, defaultCode: initialCode } = loadPageVariation(
    _rawData,
    _pageKey,
  );

  if (variationSkus.length === 0) return null;

  const defaultCode = applyListingCodeParam(
    variationSkus,
    initialCode,
    _getParam("listing-code"),
  );

  const variationsMap = buildGoodsImageVariationsMap(
    variationSkus,
    _getBaseUrl(),
  );

  return { variationSkus, defaultCode, variationsMap };
}
