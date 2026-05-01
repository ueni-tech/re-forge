// [heat-1] 解答（閲覧・比較用）

export function parseGoodsImageVariationsJson(
  raw: string | null | undefined,
): Record<string, unknown> | null {
  if (raw == null || raw === "") return null;
  try {
    const map = JSON.parse(raw) as unknown;
    if (!map || typeof map !== "object" || Array.isArray(map)) return null;
    return map as Record<string, unknown>;
  } catch {
    return null;
  }
}
