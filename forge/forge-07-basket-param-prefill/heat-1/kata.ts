// [heat-1] カートパラメーター収集: DOM 要素から payload を組み立てる
//
// 実務での使われ方:
//   商品詳細ページ（PDP）でユーザーが書体・サイズなどを選択してカートボタンを
//   押したとき「次のページでも同じ選択肢を自動入力したい」という要件がある。
//   カートボタン押下直前に DOM を走査して選択状態を収集する処理を
//   純粋関数として切り出すと、jsdom なしで単体テストが書ける。
//
// collectPayload(elements) を実装せよ。
// 引数の elements は [data-basket-param] 属性を持つ要素の配列。
// 返却する Record<string, string> は:
//   ① el.type が "radio" または "checkbox" のとき、el.checked が false ならスキップ
//   ② el.dataset.basketParam が undefined または "" ならスキップ
//   ③ el.dataset.basketValue が undefined または "" でなければ basketValue を値として使い、
//      そうでなければ el.value を値として使う（フォールバック）
//   ④ 有効なエントリが 1 件もなければ空オブジェクト {} を返す

// スタブ（変更不要）
export type CollectableElement = {
  type: string;
  checked: boolean;
  value: string;
  dataset: { basketParam?: string; basketValue?: string };
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
 * @param elements - [data-basket-param] を持つ要素の配列
 * @returns 収集したパラメーターの Record。有効エントリがなければ {}
 */
export function collectPayload(elements: CollectableElement[]): Record<string, string> {
  // ここに実装する
  throw new Error("not implemented");
}
