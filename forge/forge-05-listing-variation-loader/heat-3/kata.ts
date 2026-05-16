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
 * 【意図】呼ぶ側にとって何ができる/楽になるか？（価値を書く。挙動の説明ではなく）
 *  例: ○○を取り出せる。呼び出し側は△△の心配なく扱える。
 *
 * 【契約】何を約束するか？（前提・後条件・エッジ。理由は書かない）
 *  - 前提: 呼ぶ側が守るべきこと
 *  - 後条件: この関数が必ず保証すること
 *  - エッジ: null / 空 / 不一致 / 境界値のとき何をする/しない
 *  例:
 *    - 必ず Record<string, string> を返す（例外は投げない）
 *    - 有効なエントリが 0 件のとき {} を返す
 *
 * 【設計の読解】お題が指定した構造は、なぜその形か？（自分の選択ではなく与えられた構造への推論。自明なら省略）
 *  - なぜこの引数の型か / なぜこの戻り値の型か / なぜこの責務の切り方か
 *  例:
 *    - 引数を最小インターフェース型（CollectableElement）で受けているのは、テスト容易性のため。
 *    - DOMElement を直接受けないのは、jsdom 依存なしで単体テストを書くため。
 *
 * 【実装上の選択】自分が選んだ実装は、何と迷ってなぜそうしたか？（構造のなぜではなく自分の判断のなぜ。迷いがなければ省略）
 *  - 何と何で迷ったか / なぜこちらを選んだか
 *  例:
 *    - 早期 return を採用。スキップ条件が一目で読めるため。
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
