// [heat-1] 軸値の配列から最小値を1つ選ぶ
//
// 仕様は problem.md を参照。
// 行き詰まったら kata.solution.ts を参照。

/**
 * 最小値へのフォールバックのために集めた文字列から値を比較して最小値の文字列を返す。
 */
export function pickMinAxisValue(values: string[]): string | undefined {
  const uniqueValues = [...new Set(values.filter(Boolean))];
  if (uniqueValues.length === 0) return undefined;

  const sorted = [...uniqueValues].sort((a, b) => {
    const aNum = parseFloat(a);
    const bNum = parseFloat(b);

    const aIsNaN = Number.isNaN(aNum);
    const bIsNaN = Number.isNaN(bNum);

    if (aIsNaN && bIsNaN) return 0;
    if (aIsNaN) return 1;
    if (bIsNaN) return -1;
    return aNum - bNum;
  });

  return sorted[0];
}
