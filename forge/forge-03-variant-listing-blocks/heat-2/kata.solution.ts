// [heat-2] 解答（閲覧・比較用）

import type { PathNode } from "./kata";

export function firstListingCodeOnPath(path: readonly PathNode[]): string | null {
  for (const node of path) {
    const v = node.listingCode;
    if (v !== null && v !== undefined && v !== "") {
      return v;
    }
  }
  return null;
}
