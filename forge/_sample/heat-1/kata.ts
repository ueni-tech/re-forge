// [heat-1] キー・バリューキャッシュ
// createCache<V>() を実装せよ。
// 返却されたオブジェクトの:
//   get(key, factory) — key がキャッシュ済みならその値を返す、未キャッシュなら factory() を呼びキャッシュして返す
//   delete(key)       — 該当エントリをキャッシュから削除する

export function createCache<V>(): {
  get: (key: string, factory: () => V) => V;
  delete: (key: string) => void;
} {
  const store = new Map<string, V>();
  return {
    get(key, factory) {
      if (!store.has(key)) {
        store.set(key, factory());
      }
      return store.get(key)!;
    },
    delete(key) {
      store.delete(key);
    },
  };
}
