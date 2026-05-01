// [heat-1] data-goods-image-variations 相当の JSON 文字列を安全に読む
// parseGoodsImageVariationsJson を実装せよ。
//
// 仕様:
//   - 引数が null / undefined / 空文字のとき null を返す。
//   - JSON.parse に失敗したとき null を返す。
//   - パース結果が null、配列、または typeof が "object" でないとき null を返す。
//   - それ以外は Record<string, unknown> として返す（中身の検証はしない）。
//
// 行き詰まったら kata.solution.ts を参照。

export function parseGoodsImageVariationsJson(
  _raw: string | null | undefined,
): Record<string, unknown> | null {
  throw new Error("not implemented");
}
