// [heat-1] data-goods-image-variations 相当の JSON 文字列を安全に読む
//
// 実務での使われ方:
//   HTML の data 属性やサーバー埋め込みに JSON を載せ、クライアントで variation マップを
//   復元するとき。不正・空・型外れを全部例外にせず null に潰し、初期化やハイドレーションを
//   安全に進めるガード付きパース。
//
// parseGoodsImageVariationsJson を実装せよ。
//
// 仕様:
//   - 引数が null / undefined / 空文字のとき null を返す。
//   - JSON.parse に失敗したとき null を返す。
//   - パース結果が null、配列、または typeof が "object" でないとき null を返す。
//   - それ以外は Record<string, unknown> として返す（中身の検証はしない）。
//
// 行き詰まったら kata.solution.ts を参照。

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - 却下案: （他の書き方）→（この案だと何が困るか）ため不採用。
 *
 * @param _raw - （記述）
 * @returns パース済みマップ、不正時は null
 */
export function parseGoodsImageVariationsJson(
  _raw: string | null | undefined,
): Record<string, unknown> | null {
  throw new Error("not implemented");
}
