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
export type PageVariation = {
  variationSkus: VariationSku[];
  defaultCode: string;
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
