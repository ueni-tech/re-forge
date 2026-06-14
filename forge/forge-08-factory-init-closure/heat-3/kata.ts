// [heat-3] 複数ファクトリを合成するコーディネーター
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

// 型定義（変更不要）
export type SyncFn = (code: string) => void;
export type FactoryFn = () => SyncFn | null;

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  - picker にクリックリスナーを仕掛け、選択ボタン・カートの表示切り替えを初期化する
 *
 * 【契約】4問(正常時 / 困った入力 / しないこと / 暗黙の決め)への答え。型で表せないことだけ(任意)
 *  - picker にクリックイベントリスナーを登録し、クリックされたボタンの "data-code" で showBlock、selectButton を実行する
 *  - picker が存在しない、クリックした要素がない、[data-code]をもつ要素がない、data-code がfalsy のときは何もしない。例外も投げない。
 *  - ファクトリ呼び出しはイベント登録前に1回だけ行う
 *  - picker が存在しないときイベントリスナーを登録しない
 *  - [data-code] が見つからないクリックは無視する
 *  - showBlock / selectButton が null ならスキップ（例外なし）
 *
 *
 * 契約にはこの関数を使う側のコードが知っておく（共通認識にしておく）この関数の振る舞い※を書く
 * ※外から見た振る舞い（公開情報）を書く
 *
 *
 * 【設計の読解】お題が指定した構造の意図(任意・自明なら省略)
 *  - コールバックを外から渡すことでテストでコールバックをモックできる
 *
 *
 * @param createBlock - ブロック切り替えファクトリ（デフォルト: createBlockSwitcher）
 * @param createButton - ボタン選択ファクトリ（デフォルト: createButtonSwitcher）
 */
export function initVariantPicker(
  createBlock: FactoryFn,
  createButton: FactoryFn,
): void {
  const picker = document.querySelector<HTMLElement>(".js-variant-picker");
  if (!picker) return;

  const showBlock = createBlock();
  const selectButton = createButton();

  picker.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const clickedBtn = target.closest<HTMLElement>("[data-code]");
    if (!clickedBtn) return;
    const code = clickedBtn.dataset.code;
    if (!code) return;

    if (showBlock) showBlock(code);
    if (selectButton) selectButton(code);
  });
}
