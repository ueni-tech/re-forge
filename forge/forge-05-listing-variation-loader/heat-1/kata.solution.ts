// [heat-1] 解答（閲覧・比較用）

export type VariationSku = { code: string; label?: string };
export type PageVariation = {
  variationSkus: VariationSku[];
  defaultCode: string;
};

const emptyPageVariation = (): PageVariation => ({
  variationSkus: [],
  defaultCode: "",
});

export function loadPageVariation(
  data: unknown,
  pageKey: string,
): PageVariation {
  // ① data が配列でなければ早期 return
  if (!Array.isArray(data)) return emptyPageVariation();

  // ② pageKey をプロパティに持つ最初のオブジェクト要素を探す
  const entry = data.find(
    (item): item is Record<string, unknown> =>
      typeof item === "object" &&
      item !== null &&
      !Array.isArray(item) &&
      pageKey in item,
  );
  if (!entry) return emptyPageVariation();

  // entry[pageKey] 自体が壊れている（null など）ケースも防御
  const row = entry[pageKey];
  if (!row || typeof row !== "object") return emptyPageVariation();

  const raw = row as { variationSkus?: unknown; defaultCode?: unknown };

  // ③ variationSkus が配列でなければ [] にフォールバック
  const variationSkus: VariationSku[] = Array.isArray(raw.variationSkus)
    ? (raw.variationSkus as VariationSku[])
    : [];

  // ④ defaultCode が空でない文字列ならそれ、なければ variationSkus[0].code、それも無ければ ""
  const defaultCode =
    typeof raw.defaultCode === "string" && raw.defaultCode !== ""
      ? raw.defaultCode
      : (variationSkus[0]?.code ?? "");

  return { variationSkus, defaultCode };
}
