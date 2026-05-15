// [heat-3] Strategy パターン + フォーム適用のオーケストレーション
//
// 実務での使われ方:
//   sessionStorage から復元した prefill 値を、フォームの各 input に適用する。
//   radio / checkbox は el.click() で選択状態を変え、text 等は el.value に直接
//   代入する。input タイプによる分岐を Strategy テーブルとして表現することで、
//   新しい input タイプへの対応を追加しやすくなる。
//   initForm が DI（prefillData を引数で受け取る）になっているため、
//   sessionStorage をモックせずに単体テストが書ける。
//
// getStrategyKey(el) と initForm(form, prefillData) を実装せよ。
// getPrefillValue と applyStrategies はスタブとして提供済み（変更不要）。
//
// getStrategyKey は:
//   ① el.type が "radio" または "checkbox" のとき "checked" を返す
//   ② それ以外（"text" など）のとき "default" を返す
//
// initForm は:
//   ① form が null / undefined のとき何もしない（return）
//   ② prefillData が null / undefined のとき何もしない（return）
//   ③ form.querySelectorAll('[name^="param["]') で対象要素を取得する
//   ④ 各要素について getPrefillValue(el, prefillData) で prefill 値を取り出す
//   ⑤ 値が取れた要素のみ applyStrategies[getStrategyKey(el)](el, val) で適用する
//      ※ applyStrategies に該当キーがないとき applyStrategies.default にフォールバック

// スタブ（変更不要）
export type PrefillData = Record<string, Record<string, string>>;

export type PrefillableElement = {
  type: string;
  name: string;
  value: string;
  click: () => void;
};

export type PrefillableForm = {
  querySelectorAll: (selector: string) => PrefillableElement[];
};

// スタブ（変更不要）: heat-2 の getPrefillValue と同じ実装
export function getPrefillValue(
  el: { name?: string } | null | undefined,
  prefillData: PrefillData,
): string | undefined {
  if (!el) return undefined;
  const elementName = el.name;
  if (!elementName) return undefined;
  const match = elementName.match(
    /^param\[([^\]]+)\]\[[^\]]*\]\[[^\]]*\]\[([^\]]+)\]$/,
  );
  if (!match) return undefined;
  const listingCode = match[1];
  const templateName = match[2];
  if (!prefillData[listingCode] || !prefillData[listingCode][templateName])
    return undefined;
  return prefillData[listingCode][templateName];
}

// スタブ（変更不要）
export const applyStrategies: Record<
  string,
  (el: PrefillableElement, val: string) => void
> = {
  checked(el, val) {
    if (el.value === val) el.click();
  },
  default(el, val) {
    el.value = val;
  },
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
 *    - 必ず "checked" または "default" の文字列を返す
 *
 * 【設計の読解】お題が指定した構造は、なぜその形か？（自分の選択ではなく与えられた構造への推論。自明なら省略）
 *  - なぜこの引数の型か / なぜこの戻り値の型か / なぜこの責務の切り方か
 *  例:
 *    - キー文字列を返す形にすることで、applyStrategies テーブルから動的に
 *      関数を引けるようになる。タイプ判定と実行を分離している。
 *
 * 【実装上の選択】自分が選んだ実装は、何と迷ってなぜそうしたか？（構造のなぜではなく自分の判断のなぜ。迷いがなければ省略）
 *  - 何と何で迷ったか / なぜこちらを選んだか
 *
 * @param el - type 属性を持つ要素（最小インターフェース）
 * @returns "checked"（radio / checkbox）または "default"（それ以外）
 */
export function getStrategyKey(el: { type: string }): "checked" | "default" {
  // ここに実装する
  throw new Error("not implemented");
}

/**
 * 【意図】呼ぶ側にとって何ができる/楽になるか？（価値を書く。挙動の説明ではなく）
 *  例: ○○を取り出せる。呼び出し側は△△の心配なく扱える。
 *
 * 【契約】何を約束するか？（前提・後条件・エッジ。理由は書かない）
 *  - 前提: 呼ぶ側が守るべきこと
 *  - 後条件: この関数が必ず保証すること
 *  - エッジ: null / 空 / 不一致 / 境界値のとき何をする/しない
 *  例:
 *    - form が null のとき何もしない（例外は投げない）
 *    - prefillData が undefined のとき何もしない
 *
 * 【設計の読解】お題が指定した構造は、なぜその形か？（自分の選択ではなく与えられた構造への推論。自明なら省略）
 *  - なぜこの引数の型か / なぜこの戻り値の型か / なぜこの責務の切り方か
 *  例:
 *    - prefillData を引数で受け取る DI 形式にすることで、sessionStorage をモックせずに
 *      単体テストが書ける。
 *
 * 【実装上の選択】自分が選んだ実装は、何と迷ってなぜそうしたか？（構造のなぜではなく自分の判断のなぜ。迷いがなければ省略）
 *  - 何と何で迷ったか / なぜこちらを選んだか
 *
 * @param form - querySelectorAll を持つフォーム要素（最小インターフェース）
 * @param prefillData - parsePrefillData でパース済みのデータ
 */
export function initForm(
  form: PrefillableForm | null | undefined,
  prefillData: PrefillData | undefined,
): void {
  // ここに実装する
  throw new Error("not implemented");
}
