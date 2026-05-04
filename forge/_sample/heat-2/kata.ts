// [heat-2] TTL 付きキャッシュ
//
// 実務での使われ方:
//   API レスポンスや権限情報など、しばらくは再利用したいが永続キャッシュには
//   したくないデータを、時間経過後に自動で無効化したいとき。
//
// createTTLCache<V>(ttl: number) を実装せよ。
// get(key, factory) は heat-1 と同様だが、
// エントリは ttl ミリ秒経過後に期限切れになる。
// 期限切れエントリへの get は factory を再実行してキャッシュを更新する。
//
// 期限切れの判定は、エントリに保存した絶対時刻（例: 取得時の Date.now() + ttl）と、
// 現在の Date.now() を比較してよい（テストは Vitest の fake timers で時刻を進める）。

type Entry<V> = { value: V; expiresAt: number };

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 * `createTTLCache<V>(ttl)` で一度 `ttlCache` を作っておけば、一定時間内なら同じ値を共有でき、時間が経ったら次回の `get` で自動的に作り直されるキャッシュの入口が手に入る。
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 * - `createTTLCache<V>(ttl)` は `ttlCache`（`{ get }`）を返す。
 * - `ttlCache.get(key, factory)` は、`key` のエントリが存在し、かつ `Date.now() < expiresAt` のとき、その値を返す（`factory` は呼ばない）。
 * - エントリが無いか期限切れなら `factory()` を 1 回呼び、`expiresAt = Date.now() + ttl` でエントリを置き換え、その値を返す。
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * - 期限の絶対時刻はエントリ取得時に固定し、`createTTLCache` を呼ぶ側に持ち回らせない。期限判定の起点が散らばると整合が崩れるため。
 * - 却下案: （他の書き方）→（この案だと何が困るか）ため不採用。
 *
 * @template V キャッシュする値の型
 * @param ttl エントリの有効期限（ミリ秒）
 * @returns `get` を持つ `ttlCache` オブジェクト
 */
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
