function parseAxisSortValue(value: string): number {
  const n = parseFloat(value);
  return isNaN(n) ? Number.POSITIVE_INFINITY : n;
}

export function pickMinAxisValue(values: string[]): string | undefined {
  const unique: string[] = [];
  values.forEach((v) => {
    if (v && unique.indexOf(v) === -1) unique.push(v);
  });
  if (unique.length === 0) return undefined;
  unique.sort((a, b) => parseAxisSortValue(a) - parseAxisSortValue(b));
  return unique[0];
}
