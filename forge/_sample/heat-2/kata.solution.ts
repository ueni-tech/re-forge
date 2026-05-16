// [heat-2] 解答(閲覧・比較用)

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
