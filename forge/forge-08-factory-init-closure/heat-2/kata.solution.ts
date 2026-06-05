// [heat-2] 解答

/**
 * 【意図】
 *  - `.js-variant-picker` をキャプチャし、初期コードでボタン選択状態を同期してから
 *    `selectButton(code)` を返す。呼び出し側は返り値を受け取るだけで初期 UI が整う。
 *  - picker が存在しないページでは null を返す。
 *
 * 【契約】
 *  - picker あり + initial-code あり: ファクトリ呼び出し直後に該当ボタンが is-selected + disabled になる。
 *  - picker あり + initial-code なし or 空: 初期化副作用はスキップ。selectButton は返す。
 *  - picker なし: null を返す。例外は投げない。
 *  - selectButton はクロージャに閉じた picker を使い回す（再 querySelector しない）。
 *
 * 【設計の読解】
 *  - 初期化副作用をファクトリに含める理由: 呼び出し側（コーディネーター）が
 *    「作るだけで初期状態が整う」とシンプルになる。逆に分離すると
 *    「作る → 初期化する → ハンドラを登録する」の3ステップが呼び出し側に漏れる。
 */
export function createButtonSwitcher(): ((code: string) => void) | null {
  const picker = document.querySelector<HTMLElement>(".js-variant-picker");
  if (!picker) return null;

  function selectButton(code: string) {
    picker!
      .querySelectorAll<HTMLButtonElement>(".js-variant-btn")
      .forEach((btn) => {
        const isActive = btn.getAttribute("data-code") === code;
        btn.disabled = isActive;
        btn.classList.toggle("is-selected", isActive);
      });
  }

  const initialCode = picker.getAttribute("data-initial-code");
  if (initialCode) {
    selectButton(initialCode);
  }

  return selectButton;
}
