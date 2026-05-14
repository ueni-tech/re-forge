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
 * 【意図】
 *  同じキーに対する重い factory を 1 回だけ実行し、以後は保存済みの値を
 *  共有して読み出せる。呼び出し側は「初回か再利用か」を意識せずに済む。
 *
 * 【契約】
 *  - cache.get(key, factory): キャッシュ済みなら factory を呼ばず保存値を返す
 *  - 未キャッシュなら factory() を 1 回呼び、結果を保存して返す
 *  - cache.delete(key): 該当エントリのみ削除。次回 get で factory が再実行
 *
 * 【設計の読解】
 *  - factory を get の引数で受けることで、「保持」と「生成方法」を分離できる。
 *    同じインスタンスで異なる生成戦略を使い分けられる設計。
 *
 * 【実装上の選択】
 *  - Map を採用。任意の文字列キーで prototype 汚染がなく、has で
 *    「未キャッシュ」と「undefined を保存済み」を区別できるため。
 *
 * @template V キャッシュする値の型
 * @returns get と delete を持つ cache オブジェクト
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