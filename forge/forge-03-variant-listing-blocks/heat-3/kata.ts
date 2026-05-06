// [heat-3] ブロック更新 + variationchange 相当の通知を1か所にまとめる
//
// 実務での使われ方:
//   バリエーション選択で各行の hidden を更新したあと、ギャラリーや計測モジュールへ
//   一度だけ通知したいとき。更新ロジックと CustomEvent に相当する notify を
//   まとめ、呼び出し側の重複を防ぐファクトリ。
//
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

function hiddenFlagsForSelection(
  blocks: BlockRow[],
  listingCode: string,
): void {
  for (const block of blocks) {
    block.hidden = block.listingCode !== listingCode;
  }
}

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 * - blocks とnotify が設定済みのselectメソッドを持つオブジェクトを作ることができる
 * - select関数 に出品コードを渡すとblocks 内を走査して出品コードと同じ値を持つBlockRow の表示（hiddenをfalse）と
 * 更新ロジック（notify）を実行することができる
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 * - createVariationSelectionSession: blocks とnotify が設定済みのselectメソッドを持つオブジェクトを返す
 * - select: 受け取ったlistingCode からhiddenFlagsForSelection と同じ規則で各行の hidden を更新し、
 * その後 notify({ listingCode }) を必ず1回呼ぶ
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - ファクトリにすることで呼び出し側がblocks とnotify を知る必要がなくなり責務の分離ができる
 * - 却下案: 毎回`blocks`と`notfy` を渡す裸関数にすると呼び出しが冗長で通知漏れが起きやすいため不採用
 *
 * @param blocks - 走査対象のコードブロック
 * @param notify - ブロック更新を知らせる通知ロジック
 * @returns `select` を持つセッションオブジェクト
 */
export function createVariationSelectionSession(
  blocks: BlockRow[],
  notify: (detail: { listingCode: string }) => void,
): { select(listingCode: string): void } {
  return {
    select(listingCode) {
      if (!blocks.some((block) => block.listingCode === listingCode)) {
        return;
      }
      hiddenFlagsForSelection(blocks, listingCode);
      notify({ listingCode });
    },
  };
}
