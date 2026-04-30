// [heat-1] 解答（閲覧・比較用）

export function hiddenFlagsForSelection(
  rows: readonly string[],
  selected: string,
): boolean[] {
  const hit = rows.includes(selected);
  return rows.map((code) => !hit || code !== selected);
}
