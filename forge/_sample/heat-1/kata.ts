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
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 * `createCache<V>()` で一度 `cache` を作っておけば、同じキーに対する重い `factory` は 1 回だけ実行され、以後は保存済みの値を共有して読み出せる入口が手に入る。
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 * - `createCache<V>()` は `cache`（`{ get, delete }`）を返す。
 * - `cache.get(key, factory)` は、`key` がキャッシュ済みならその値を返し、`factory` は呼ばない。未キャッシュなら `factory()` を 1 回呼んで保存し、その値を返す。
 * - `cache.delete(key)` はそのキーのエントリだけを消す。次回の `cache.get(key, factory)` で `factory` が再実行される。
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - 「初回だけ実行・以後は再利用」を `createCache` を呼ぶ側で `if (cached)` ガードすると書き忘れが起きるので、`Map` とロジックをこの関数に閉じる。
 * - 却下案: （他の書き方）→（この案だと何が困るか）ため不採用。
 *
 * @template V キャッシュする値の型
 * @returns `get` と `delete` を持つ `cache` オブジェクト
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
