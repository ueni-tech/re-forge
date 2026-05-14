// [heat-1] キー・バリューキャッシュ
//
// 実務での使われ方:
//   同一キーに対する重い factory（設定オブジェクトの構築・パース結果など)を
//   1回だけ実行し、以降は共有インスタンスを返したいときのメモ化パターン。
//
// createCache<V>() を実装せよ。
// 返却されたオブジェクトの:
//   get(key, factory) — key がキャッシュ済みならその値を返す、未キャッシュなら factory() を呼びキャッシュして返す
//   delete(key)       — 該当エントリをキャッシュから削除する

/**
 * 【意図】
 * `createCache<V>()` で一度 `cache` を作っておけば、同じキーに対する重い `factory` は 1 回だけ実行され、以後は保存済みの値を共有して読み出せる入口が手に入る。
 *
 * 【契約】
 * - 前提: `factory` は呼ばれたとき同じキーに対して同じ値を返すこと（純粋性は呼ぶ側の責任）。
 * - 後条件: `createCache<V>()` は `cache`（`{ get, delete }`）を返す。
 * - `cache.get(key, factory)` は `key` がキャッシュ済みならその値を返し、`factory` は呼ばない。未キャッシュなら `factory()` を 1 回呼んで保存し、その値を返す。
 * - `cache.delete(key)` はそのキーのエントリだけを消す。次回の `cache.get(key, factory)` で `factory` が再実行される。
 *
 * 【設計の読解】
 * - `factory` を `get` 側の引数として受ける形にしている。これにより「キャッシュの保持」と「値の生成方法」を分離でき、同じ `cache` インスタンスで異なる生成戦略を使い分けられる。
 * - `delete` をエントリ単位にしているのは、`clear` 全削除より「特定キーを意図的に無効化する」操作の方がメモ化の運用で求められやすいため。
 *
 * 【実装上の選択】
 * - `Map` を採用（オブジェクトリテラルでなく）。任意の文字列キーに対し prototype 汚染の心配がなく、`has` で「未キャッシュ」と「`undefined` を保存済み」を区別できるため。
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
