// [heat-2] 模範解答 — 閲覧用。練習では kata.ts を編集すること。
export function createLatestByGeneration<T>(
  load: (key: string) => Promise<T>,
): (key: string) => Promise<T | null> {
  let generation = 0;
  return async (key: string) => {
    const mine = ++generation;
    const value = await load(key);
    return mine === generation ? value : null;
  };
}
