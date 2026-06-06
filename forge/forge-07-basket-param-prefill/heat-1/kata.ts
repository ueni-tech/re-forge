// [heat-1] DOM 要素から payload を組み立てる
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。
// NOTE: この heat の合意済み仕様（一次ソース）は problem.md に明記されている。

// 最小インターフェース型（変更不要）
export type CollectableElement = {
  type: string;
  checked: boolean;
  value: string;
  dataset: { basketParam?: string; basketValue?: string };
};

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  - ユーザーの入力情報をまとめた対応表が手に入る
 *
 * 【契約】4問(正常時 / 困った入力 / しないこと / 暗黙の決め)への答え。型で表せないことだけ(任意)
 *  - チェック済み、テキスト入力済みフォームの basketParam と basketValue の対応表を返す
 *  - basketParam がfalsy なエントリはスキップする
 *  - basketValue が falsy なら value にフォールバックする
 *
 * 【設計の読解】お題が指定した型・構造の意図(任意・自明なら省略)
 *  - jsdom なしでプレーンオブジェクトのテストが書ける。シグネチャを見れば「この関数が DOM のどこを触るか」が分かる。
 *
 * 【実装メモ】自分が迷った判断(任意・迷いがなければ省略)
 *  - 関数の定義はループの外に書く
 *  - 外の変数を閉じ込めることに意味がある時だけクロージャーとしてループ内で定義する
 *  - 三項演算子の右辺は「返す値」。右辺に作用は書かないのが慣例（if文のように扱わない）
 *
 * @param elements - [data-basket-param] を持つ要素の配列(の最小インターフェース表現)
 */
export function collectPayload(
  elements: CollectableElement[],
): Record<string, string> {
  const payload: Record<string, string> = {};

  function buildPayload(
    payload: Record<string, string>,
    basketParam: string | undefined,
    basketValue: string | undefined,
    value: string,
  ): void {
    if (!basketParam) return;
    payload[basketParam] = basketValue || value;
  }

  elements.forEach((elm) => {
    if (elm.type !== "radio" && elm.type !== "checkbox") {
      buildPayload(
        payload,
        elm.dataset.basketParam,
        elm.dataset.basketValue,
        elm.value,
      );
      return;
    }

    if (!elm.checked) return;

    buildPayload(
      payload,
      elm.dataset.basketParam,
      elm.dataset.basketValue,
      elm.value,
    );
  });

  return payload;
}
