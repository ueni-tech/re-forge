// [heat-3] Strategy パターン + DI によるフォーム適用
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

// 型定義（変更不要）
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

// Strategy テーブル（変更不要）
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
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  -
 *
 * 【契約】4問(正常時 / 困った入力 / しないこと / 暗黙の決め)への答え。型で表せないことだけ(任意)
 *  -
 *
 * 【設計の読解】お題が指定した型・構造の意図(任意・自明なら省略)
 *  - なぜ Strategy 関数そのものではなくキー文字列を返す形か
 *
 * 【実装メモ】自分が迷った判断(任意・迷いがなければ省略)
 *  -
 *
 * @param el - type 属性を持つ要素(の最小インターフェース)
 */
export function getStrategyKey(el: { type: string }): "checked" | "default" {
  throw new Error("not implemented");
}

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  -
 *
 * 【契約】4問(正常時 / 困った入力 / しないこと / 暗黙の決め)への答え。型で表せないことだけ(任意)
 *  -
 *
 * 【設計の読解】お題が指定した型・構造の意図(任意・自明なら省略)
 *  - なぜ prefillData を引数で受け取る DI 形式にしているか（【契約】と混ぜない）
 *  - なぜ querySelectorAll のセレクタを '[name^="param["]' に絞っているか
 *  - DI の理由・Strategy の理由は【契約】ではなくここへ
 *
 * 【実装メモ】自分が迷った判断(任意・迷いがなければ省略)
 *  -
 *
 * @param form - querySelectorAll を持つフォーム要素(の最小インターフェース)
 * @param prefillData - parsePrefillData でパース済みのデータ
 */
export function initForm(
  form: PrefillableForm | null | undefined,
  prefillData: PrefillData | undefined,
): void {
  throw new Error("not implemented");
}
