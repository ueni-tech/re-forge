// [heat-1] DOM をキャプチャしてハンドラを生成する
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

/**
 * 【意図】呼ぶ側にとっての価値を1〜2行で(必須)
 *  - 呼び出すと対象 DOM を固定した表示切替関数が手に入る。
 *  - 対象 DOM が存在しないページでは null が返るので呼び出し側で処理フローの判断ができる
 *
 * 【契約】4問(正常時 / 困った入力 / しないこと / 暗黙の決め)への答え。型で表せないことだけ(任意)
 *  - コンテナあり: showBlock を返す。 showBlock は呼ぶたび全 .js-variant-block を走査し、 data-code が一致するものだけを hidden = false する
 *  - コンテナなし: null を返す。例外は投げない
 *  - showBlock の中で querySelector し直さない。（クロージャーに閉じた参照を使いまわす）
 *  - 一致する data-code がないときは全件 hedden = true になる
 *
 * 【設計の読解】お題が指定した構造の意図(任意・自明なら省略)
 *  - ファクトリではなく直接 showBlock を呼び出す方法だと呼び出しのたびに querySelector が走り処理を重くする要因になる
 *  - 対象 DOM 不在の判定が関数内に隠れるため原因調査時に関数内部まで調べる必要がある
 *
 * 【実装メモ】自分が迷った判断(任意・迷いがなければ省略)
 *  - 複数コンテナも同期する
 */
export function createBlockSwitcher(): ((code: string) => void) | null {
  const roots = document.querySelectorAll<HTMLElement>(".js-variant-blocks");
  if (!roots.length) return null;

  function showBlock(code: string) {
    roots.forEach((root) => {
      const blocks = root.querySelectorAll<HTMLElement>(".js-variant-block");
      blocks.forEach((block) => {
        block.hidden = block.dataset.code !== code;
      });
    });
  }

  return showBlock;
}
