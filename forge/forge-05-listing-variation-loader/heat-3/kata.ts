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
 *  - 商品詳細ページのコントローラが1回呼ぶだけで
 *  variationSkus / defaultCode / variationsMap を受け取れる
 *
 * 【契約】4問(正常時 / 困った入力 / しないこと / 暗黙の決め)への答え。型で表せないことだけ(任意)
 *  - 正常時: variationSkus / defaultCode / variationsMap をまとめて返す
 *  - JSON 由来のバリエーションが空（または pageKey 不一致） → null (空の PrepareResult は返さない)
 *  - getParam("listing-code") が null または variationSkus に無い code → 返却する defaultCode は JSON 由来の初期値のまま（クエリで上書きしない）
 *  - 例外は投げない（不正 JSON・不正クエリは吸収して null またはフォールバック）
 *
 * 【設計の読解】お題が指定した型・構造の意図(任意・自明なら省略)
 *  - getParam / getBaseUrl を引数にして window 依存を外し、テストと責務の可視化を両立する
 *  - null は「このページ用バリエーションが存在しない」を呼び出し元に委ねる
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
  const pageVariation: PageVariation = loadPageVariation(rawData, pageKey);
  const variationSkus = pageVariation.variationSkus;
  const initialCode = pageVariation.defaultCode;

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
