// [heat-2] クエリパラメータの上書きと goods-image-variations 用 URL マップ生成
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

import type { VariationSku } from "../heat-1/kata";
export type { VariationSku };

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  - バリエーションに含まれているコードが確実に手に入る
 *  - URL クエリパラメータから取得したコードがバリエーションに含まれていない場合でもdefaultCodeにフォールバックしてコードが手に入る
 *
 * 【契約】型と問題文で表現できないことだけ書く(任意)
 *  - requestCode がnull / undefined なら defaultCode を返却する
 *  - requestedCode が variationSkus のどの code とも一致しないときは defaultCode を返却する
 *  - コードの比較は完全一致、前後トリムは行わない（不正な値は弾きたいため）
 *
 * 【設計の読解】お題が指定した型・構造の意図(任意・自明なら省略)
 *  - defaultCode は常に文字列が与えられる
 *  - 必ず文字列を返却する
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
  if (!requestedCode) {
    return defaultCode;
  }
  for (const sku of variationSkus) {
    if (sku.code === requestedCode) {
      return sku.code;
    }
  }
  return defaultCode;
}

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  - 出品コードとその商品画像パスが対応関係になったマップが手に入る
 *
 * 【契約】型と問題文で表現できないことだけ書く(任意)
 *  - 各 sku.code をキーに { path: baseUrl + code + ".html" } を格納する
 *  - variationSkus が空配列ならば {} を返す
 *  - code が空文字のときはスキップする
 *  - 同一 code が複数ある場合、後のエントリで上書きする
 *  - baseUrl の末尾スラッシュがない場合は正規化しない（呼び出し側の責務）
 *
 * 【設計の読解】お題が指定した型・構造の意図(任意・自明なら省略)
 *  - path の到達性や baseUrl の妥当性は検証しない（文字列連結だけ。壊れた URL は呼び出し側の話）
 *  - 戻りを Record にしているのは、バリエーション code から path を O(1)で引くため
 *  - 値を { path } オブジェクトにしているのは、文字列1本より属性用データの拡張に耐えやすいため
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
  const result: Record<string, { path: string }> = {};
  for (const sku of variationSkus) {
    if (!sku.code) {
      continue;
    }
    result[sku.code] = { path: baseUrl + sku.code + ".html" };
  }
  return result;
}
