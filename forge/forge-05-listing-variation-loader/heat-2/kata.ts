// [heat-2] クエリパラメータの上書きと goods-image-variations 用 URL マップ生成
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

import type { VariationSku } from "../heat-1/kata";
export type { VariationSku };

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  -
 *
 * 【契約】型と問題文で表現できないことだけ書く(任意)
 *  -
 *
 * 【設計の読解】お題が指定した型・構造の意図(任意・自明なら省略)
 *  -
 *
 * 【実装メモ】自分が迷った判断(任意)
 *  -
 *
 * @param variationSkus - 有効なバリエーションコードの一覧
 * @param defaultCode - JSON 由来の初期コード
 * @param requestedCode - URL クエリパラメータから取得したコード
 */
export function applyListingCodeParam(
  variationSkus: VariationSku[],
  defaultCode: string,
  requestedCode: string | null | undefined,
): string {
  throw new Error("not implemented");
}

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  -
 *
 * 【契約】型と問題文で表現できないことだけ書く(任意)
 *  -
 *
 * 【設計の読解】お題が指定した型・構造の意図(任意・自明なら省略)
 *  -
 *
 * 【実装メモ】自分が迷った判断(任意)
 *  -
 *
 * @param variationSkus - バリエーション SKU の一覧
 * @param baseUrl - URL のベースパス(末尾スラッシュあり)
 */
export function buildGoodsImageVariationsMap(
  variationSkus: VariationSku[],
  baseUrl: string,
): Record<string, { path: string }> {
  throw new Error("not implemented");
}
