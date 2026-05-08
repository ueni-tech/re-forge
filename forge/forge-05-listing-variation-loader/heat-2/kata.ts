// [heat-2] クエリパラメータの上書きと goods-image-variations 用 URL マップ生成
//
// 実務での使われ方:
//   商品詳細ページが ?listing-code=ST-TKV-A1 で開かれたとき、
//   variationSkus に含まれるコードなら初期表示コードを上書きし（無効なら無視）、
//   さらに各コードから data-goods-image-variations 用の URL マップを作る。
//   どちらも「JSON 読み込み後・ページ出力前」に挟まる純粋変換ステップ。
//
// applyListingCodeParam(variationSkus, defaultCode, requestedCode) を実装せよ。
//   ① requestedCode が null / undefined / 空文字のとき defaultCode をそのまま返す。
//   ② requestedCode が variationSkus のいずれの code にも一致しないとき defaultCode を返す。
//   ③ 一致するものがあれば requestedCode を返す。
//   ※ trim は行わない。コードは完全一致で判定する。
//
// buildGoodsImageVariationsMap(variationSkus, baseUrl) を実装せよ。
//   ① variationSkus の各 code に対して { path: baseUrl + code + ".html" } を作り、
//      code をキーとして Record に格納する。
//   ② code が空文字のエントリはスキップする。
//   ③ variationSkus が空なら空オブジェクト {} を返す。
//
// 行き詰まったら kata.solution.ts を参照。

import type { VariationSku } from "../heat-1/kata";
export type { VariationSku };

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - 却下案: （他の書き方）→（この案だと何が困るか）ため不採用。
 *
 * @param _variationSkus - 有効なバリエーションコードの一覧
 * @param _defaultCode - JSON 由来の初期コード
 * @param _requestedCode - URL クエリパラメータから取得したコード（存在しなければ null）
 * @returns 最終的な初期コード
 */
export function applyListingCodeParam(
  _variationSkus: VariationSku[],
  _defaultCode: string,
  _requestedCode: string | null | undefined,
): string {
  throw new Error("not implemented");
}

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - 却下案: （他の書き方）→（この案だと何が困るか）ため不採用。
 *
 * @param _variationSkus - バリエーション SKU の一覧
 * @param _baseUrl - URL のベースパス（末尾スラッシュあり、例: "https://www.hankoya.com/shop/item/sample/"）
 * @returns コードをキー、`{ path }` を値とするマップ
 */
export function buildGoodsImageVariationsMap(
  _variationSkus: VariationSku[],
  _baseUrl: string,
): Record<string, { path: string }> {
  throw new Error("not implemented");
}
