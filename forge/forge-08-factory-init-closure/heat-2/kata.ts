// [heat-2] ファクトリ呼び出し時に初期化副作用を実行する
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  - ボタンの状態をHTMLに埋め込まれた状態に合わせて初期化し、かつボタン状態の切り替え関数が手に入る
 *
 * 【契約】4問(正常時 / 困った入力 / しないこと / 暗黙の決め)への答え。型で表せないことだけ(任意)
 *  - picker があり、initialCodeもある: 初期化を行い、selectButton を返す。selectButton は picker を走査して dataset.code === code に合わせてdisabled と .is-selected の付け外しを行う
 *  - picker がない: null を返す。例外はなげない。
 *  - picker がある, initialCode がない: 初期化処理はスキップして selectButton を返す
 *
 * 【設計の読解】お題が指定した構造の意図(任意・自明なら省略)
 *  - ファクトリではなく直接 selectButton を呼び出す方法だと呼び出しのたびに querySelector が走り処理を重くする要因になる
 *  - 初期化も別途必要になる
 *  - picker 不在の判定が関数内に隠れるため原因調査時に関数内部まで調べる必要がある
 *
 */
export function createButtonSwitcher(): ((code: string) => void) | null {
  const pickerOrNull =
    document.querySelector<HTMLElement>(".js-variant-picker");
  if (!pickerOrNull) return null;

  const picker: HTMLElement = pickerOrNull;

  function selectButton(code: string): void {
    const buttons =
      picker.querySelectorAll<HTMLButtonElement>(".js-variant-btn");
    buttons.forEach((btn) => {
      const active = btn.dataset.code === code;
      btn.disabled = active;
      btn.classList.toggle("is-selected", active);
    });
  }

  const initialCode = picker.dataset.initialCode;
  if (initialCode) {
    selectButton(initialCode);
  }

  return selectButton;
}
