// [heat-1] キー・バリューキャッシュ
//
// 実務での使われ方:
//   同一キーに対する重い factory（設定オブジェクトの構築・パース結果など）を
//   1回だけ実行し、以降は共有インスタンスを返したいときのメモ化パターン。
//
// createCache<V>() を実装せよ。
// 返却されたオブジェクトの:
//   get(key, factory) — key がキャッシュ済みならその値を返す、未キャッシュなら factory() を呼びキャッシュして返す
//   delete(key)       — 該当エントリをキャッシュから削除する

/**
 * 【責務】（記述）
 *
 * 【ここで切る理由】（記述）
 *
 * @template V キャッシュする値の型
 * @returns `get` と `delete` を持つキャッシュオブジェクト
 */
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
