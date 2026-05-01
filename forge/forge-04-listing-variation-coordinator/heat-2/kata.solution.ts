// [heat-2] 解答（閲覧・比較用）

export function variationMapHasCode(
  map: Record<string, unknown> | null,
  code: string,
): boolean {
  if (!code) return false;
  if (!map) return false;
  return Object.prototype.hasOwnProperty.call(map, code);
}

export function resolveInitialListingCode(
  attr: string | null,
  orderedKeys: readonly string[],
): string | null {
  const trimmed = attr?.trim();
  if (trimmed) return trimmed;
  return orderedKeys.length ? orderedKeys[0] : null;
}
