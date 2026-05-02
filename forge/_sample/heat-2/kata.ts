// [heat-2] TTL 付きキャッシュ
// createTTLCache<V>(ttl: number) を実装せよ。
// get(key, factory) は heat-1 と同様だが、
// エントリは ttl ミリ秒経過後に期限切れになる。
// 期限切れエントリへの get は factory を再実行してキャッシュを更新する。
//
// 期限切れの判定は、エントリに保存した絶対時刻（例: 取得時の Date.now() + ttl）と、
// 現在の Date.now() を比較してよい（テストは Vitest の fake timers で時刻を進める）。

type Entry<V> = { value: V; expiresAt: number };

export function createTTLCache<V>(ttl: number): {
  get: (key: string, factory: () => V) => V;
} {
  const store = new Map<string, Entry<V>>();
  return {
    get(key, factory) {
      const entry = store.get(key);
      if (entry !== undefined && Date.now() < entry.expiresAt) {
        return entry.value;
      }
      const value = factory();
      store.set(key, { value, expiresAt: Date.now() + ttl });
      return value;
    },
  };
}
