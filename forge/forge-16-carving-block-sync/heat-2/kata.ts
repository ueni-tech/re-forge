// [heat-2] 表示中 block からドラフトを退避・復元する
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

export type EngravingDraft = {
  carvingFontValue: string;
  textLine1: string;
  textLine2: string;
};

/**
 * （何のための関数か。1文）
 */
export function captureDraftFromVisibleBlocks(): void {
  throw new Error("not implemented");
}

/**
 * （何のための関数か。1文）
 */
export function syncCarvingFontChecked(): void {
  throw new Error("not implemented");
}

/**
 * （何のための関数か。1文）
 */
export function applyDraftToVisibleBlocks(): void {
  throw new Error("not implemented");
}

/** テスト用: 現在の draft のコピー */
export function getEngravingDraft(): EngravingDraft {
  throw new Error("not implemented");
}

/** テスト用: draft を空に戻す */
export function resetEngravingDraft(): void {
  throw new Error("not implemented");
}
