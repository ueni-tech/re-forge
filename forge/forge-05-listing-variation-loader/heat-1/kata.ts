// [heat-1] listing-variations.json からページキーのエントリを取得する
//
// 実務での使われ方:
//   商品詳細ページのコントローラが listing-variations.json を読み込み、
//   ページ自身のキー（ファイル名）でエントリを探してバリエーション一覧と
//   初期コードを取得する。PHP 版では __FILE__ からキーを導出するが、
//   TS 版は「パース済みの unknown を受け取り純粋に変換する」形で再現する。
//
// loadPageVariation(data, pageKey) を実装せよ。
//
// 仕様:
//   ① data が配列でない（null・undefined・オブジェクト・プリミティブ含む）場合、
//      { variationSkus: [], defaultCode: "" } を返す。
//   ② data の各要素を順に走査し、オブジェクトかつ pageKey をプロパティに持つ
//      最初の要素から該当行を取り出す。
//   ③ 該当行の variationSkus が配列なら使い、配列でなければ [] とする。
//   ④ 該当行の defaultCode が空でない文字列なら使う。
//      空文字・非文字列・未定義のときは variationSkus[0].code（存在すれば）を使い、
//      それも無ければ "" とする。
//   ⑤ pageKey が見つからない場合、{ variationSkus: [], defaultCode: "" } を返す。
//
// 行き詰まったら kata.solution.ts を参照。

export type VariationSku = { code: string; label?: string };
export type PageVariation = { variationSkus: VariationSku[]; defaultCode: string };

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - 却下案: （他の書き方）→（この案だと何が困るか）ため不採用。
 *
 * @param _data - listing-variations.json をパースした値（unknown）
 * @param _pageKey - 探したいページキー（例: "sample"）
 * @returns 見つかったエントリの variationSkus と defaultCode、見つからなければ空値
 */
export function loadPageVariation(
  _data: unknown,
  _pageKey: string,
): PageVariation {
  throw new Error("not implemented");
}
