// [heat-1] 解答

/**
 * 【意図】
 *  - `.js-variant-blocks` を初期化時に一度だけキャプチャし、
 *    `showBlock(code)` を呼ぶたびに対応ブロックを表示・他を非表示に切り替える関数を返す。
 *  - コンテナが存在しないページでは null を返し、呼び出し側が「この同期は不要」と判断できる。
 *
 * 【契約】
 *  - コンテナあり: showBlock を返す。showBlock は呼ぶたびに全 .js-variant-block を走査し、
 *    data-code が一致するものだけ hidden=false にする。
 *  - コンテナなし: null を返す。例外は投げない。
 *  - showBlock の中で querySelector し直さない（クロージャに閉じた参照を使い回す）。
 *  - 一致する data-code がないとき全件 hidden=true になる（no-op ではなく仕様）。
 *
 * 【設計の読解】
 *  - querySelector をファクトリ内でやる理由: クリックのたびに DOM を再取得するコストを避け、
 *    「コンテナが存在するか」の判定も一度で済ませるため。
 *  - null を返す設計: 呼び出し側が `if (switcher)` で分岐できる。
 *    no-op を返すと「コンテナ不在でも正常」と見えてデバッグが難しくなる。
 */
export function createBlockSwitcher(): ((code: string) => void) | null {
  const container = document.querySelector<HTMLElement>(".js-variant-blocks");
  if (!container) return null;

  return function showBlock(code: string) {
    container
      .querySelectorAll<HTMLElement>(".js-variant-block")
      .forEach((el) => {
        el.hidden = el.getAttribute("data-code") !== code;
      });
  };
}
