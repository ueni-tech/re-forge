// [heat-3] ブロック更新 + variationchange 相当の通知を1か所にまとめる
// createVariationSelectionSession を実装せよ。
//
// BlockRow は UI の1行（カート用ブロック）に対応し、listingCode と hidden を持つ。
// 返却された select(listingCode) は:
//   ① blocks のどの行とも listingCode が一致しない場合、何もしない（notify も呼ばない）。
//   ② 一致する行があれば、hiddenFlagsForSelection と同じ規則で各行の hidden を更新する。
//   ③ その後 notify({ listingCode }) を必ず1回呼ぶ（②で更新したあとの値を参照できる）。
//
// そのほか:
//   - 渡された blocks 配列および各行オブジェクトはミュータブルとみなし、hidden はその場で更新する（新しい配列を返さない）。
//   - notify は select の同期的な処理の末尾で呼ぶ（テストは同期的な呼び出し回数を検証する）。
//
// 行き詰まったら kata.solution.ts を参照。

export type BlockRow = { listingCode: string; hidden: boolean };

export function createVariationSelectionSession(
  _blocks: BlockRow[],
  _notify: (detail: { listingCode: string }) => void,
): { select(listingCode: string): void } {
  throw new Error("not implemented");
}
