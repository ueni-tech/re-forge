// [heat-3] DI 付きオーケストレーター
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

// 既実装ヘルパー(変更不要)
import type { VariationSku, PageVariation } from "../heat-1/kata";
export type { VariationSku, PageVariation };

export function loadPageVariation(
  data: unknown,
  pageKey: string,
): PageVariation {
  if (!Array.isArray(data)) return { variationSkus: [], defaultCode: "" };
  for (const element of data) {
    if (!element || typeof element !== "object" || Array.isArray(element))
      continue;
    const record = element as Record<string, unknown>;
    if (!(pageKey in record)) continue;
    const row = record[pageKey];
    if (!row || typeof row !== "object" || Array.isArray(row)) continue;
    const entry = row as Record<string, unknown>;
    const variationSkus = Array.isArray(entry["variationSkus"])
      ? (entry["variationSkus"] as VariationSku[])
      : [];
    let defaultCode =
      typeof entry["defaultCode"] === "string" && entry["defaultCode"] !== ""
        ? entry["defaultCode"]
        : "";
    if (defaultCode === "" && variationSkus.length > 0) {
      defaultCode = variationSkus[0].code ?? "";
    }
    return { variationSkus, defaultCode };
  }
  return { variationSkus: [], defaultCode: "" };
}

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

// ─────────────────────────────────────────────

export type PrepareResult = {
  variationSkus: VariationSku[];
  defaultCode: string;
  variationsMap: Record<string, { path: string }>;
};

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  - 呼び出し側は「3つの関数を順に呼ぶ」と書かない。意図を書く。
 *
 * 【契約】型と問題文で表現できないことだけ書く(任意)
 *  -
 *
 * 【設計の読解】お題が指定した型・構造の意図(任意・自明なら省略)
 *  - getParam / getBaseUrl を関数として注入する設計の意図は?
 *  - 戻り値が null になり得る設計の意図は?
 *
 * 【実装メモ】自分が迷った判断(任意)
 *  -
 *
 * @param rawData - listing-variations.json をパースした値
 * @param pageKey - ページキー
 * @param getParam - クエリパラメータ取得関数
 * @param getBaseUrl - ベース URL 取得関数
 */
export function prepareVariation(
  rawData: unknown,
  pageKey: string,
  getParam: (name: string) => string | null,
  getBaseUrl: () => string,
): PrepareResult | null {
  throw new Error("not implemented");
}
