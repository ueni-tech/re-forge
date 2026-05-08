// [heat-1] 解答（閲覧・比較用）

export type VariationSku = { code: string; label?: string };
export type PageVariation = { variationSkus: VariationSku[]; defaultCode: string };

const EMPTY: PageVariation = { variationSkus: [], defaultCode: "" };

export function loadPageVariation(data: unknown, pageKey: string): PageVariation {
  if (!Array.isArray(data)) return EMPTY;

  for (const element of data) {
    if (!element || typeof element !== "object" || Array.isArray(element)) continue;
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

  return EMPTY;
}
