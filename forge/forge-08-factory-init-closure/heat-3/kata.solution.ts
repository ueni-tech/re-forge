// [heat-3] 解答

export type SyncFn = (code: string) => void;
export type FactoryFn = () => SyncFn | null;

/**
 * 【意図】
 *  - createBlockSwitcher と createButtonSwitcher を合成し、
 *    .js-variant-picker へのクリックで両方を呼ぶエントリポイント。
 *  - 各ファクトリが null を返す場合は呼ばない。ページ構成を知る必要がない。
 *
 * 【契約】
 *  - ファクトリ呼び出しはイベント登録前に1回だけ行う（クリックのたびに呼ばない）。
 *  - picker が存在しないときイベントリスナーを登録しない。
 *  - [data-code] が見つからないクリックは無視する。
 *  - showBlock / selectButton が null ならスキップ（例外なし）。
 *
 * 【設計の読解】
 *  - DI にする理由: テストでスタブ関数を渡せる。
 *    直接 import すると DOM セットアップが必要になり、テストが複雑になる。
 *  - null ガード（if 文）: 「存在しない」を null で表す設計と対になる。
 *    no-op なら if が不要だが、「不在」の情報が消える。
 */
export function initVariantPicker(
  createBlock: FactoryFn,
  createButton: FactoryFn,
): void {
  const picker = document.querySelector<HTMLElement>(".js-variant-picker");
  if (!picker) return;

  const showBlock = createBlock();
  const selectButton = createButton();

  picker.addEventListener("click", function (e: MouseEvent) {
    const target = e.target as Element | null;
    if (!target) return;
    const btn = target.closest<HTMLElement>("[data-code]");
    if (!btn) return;
    const code = btn.getAttribute("data-code");
    if (!code) return;

    if (showBlock) showBlock(code);
    if (selectButton) selectButton(code);
  });
}
