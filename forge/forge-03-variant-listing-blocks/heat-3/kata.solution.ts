// [heat-3] 解答（閲覧・比較用）

import type { BlockRow } from "./kata";

function applyHidden(blocks: BlockRow[], selected: string): void {
  const hit = blocks.some((b) => b.listingCode === selected);
  for (const b of blocks) {
    b.hidden = !hit || b.listingCode !== selected;
  }
}

export function createVariationSelectionSession(
  blocks: BlockRow[],
  notify: (detail: { listingCode: string }) => void,
): { select(listingCode: string): void } {
  return {
    select(listingCode: string) {
      if (!blocks.some((b) => b.listingCode === listingCode)) {
        return;
      }
      applyHidden(blocks, listingCode);
      notify({ listingCode });
    },
  };
}
