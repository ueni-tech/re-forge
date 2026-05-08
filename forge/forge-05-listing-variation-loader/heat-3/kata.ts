// [heat-3] DI 付きオーケストレーター — JSON 読み込み・クエリ適用・マップ生成を 1 入口に束ねる
//
// 実務での使われ方:
//   PHP の variation_prepare() 相当。商品詳細ページのコントローラが
//   1 回呼ぶだけで variationSkus / defaultCode / variationsMap を受け取れるようにする。
//   URL クエリや baseUrl への依存は getParam / getBaseUrl を注入してテスト可能にする。
//
// prepareVariation(rawData, pageKey, getParam, getBaseUrl) を実装せよ。
//
// 仕様:
//   ① loadPageVariation(rawData, pageKey) を呼び variationSkus と defaultCode を取得する。
//   ② variationSkus.length === 0 なら null を返す（PHP 版の 404 exit に相当）。
//   ③ getParam("listing-code") の値と variationSkus・defaultCode を
//      applyListingCodeParam に渡し、確定した defaultCode を得る。
//   ④ getBaseUrl() を呼び buildGoodsImageVariationsMap(variationSkus, baseUrl) で
//      variationsMap を生成する。
//   ⑤ { variationSkus, defaultCode, variationsMap } を返す。
//
// 行き詰まったら kata.solution.ts を参照。

// 既実装ヘルパー（変更不要）
import type { VariationSku, PageVariation } from "../heat-1/kata";
export type { VariationSku, PageVariation };

export function loadPageVariation(data: unknown, pageKey: string): PageVariation {
  if (!Array.isArray(data)) return { variationSkus: [], defaultCode: "" };
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
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - 却下案: （他の書き方）→（この案だと何が困るか）ため不採用。
 *
 * @param _rawData - listing-variations.json をパースした値（unknown）
 * @param _pageKey - ページキー（例: "sample"）
 * @param _getParam - クエリパラメータ取得関数（例: `(name) => new URLSearchParams(location.search).get(name)`）
 * @param _getBaseUrl - ベース URL 取得関数（例: `() => location.href.replace(/[^/]+$/, "")`）
 * @returns PrepareResult、バリエーションが空なら null
 */
export function prepareVariation(
  _rawData: unknown,
  _pageKey: string,
  _getParam: (name: string) => string | null,
  _getBaseUrl: () => string,
): PrepareResult | null {
  throw new Error("not implemented");
}
