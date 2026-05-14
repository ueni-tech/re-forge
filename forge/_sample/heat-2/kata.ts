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
 * 【意図】
 * `createTTLCache<V>(ttl)` で一度 `ttlCache` を作っておけば、一定時間内なら同じ値を共有でき、時間が経ったら次回の `get` で自動的に作り直されるキャッシュの入口が手に入る。
 *
 * 【契約】
 * - 前提: `ttl` は正の数（ミリ秒）。
 * - 後条件: `createTTLCache<V>(ttl)` は `ttlCache`（`{ get }`）を返す。
 * - `ttlCache.get(key, factory)` は、`key` のエントリが存在し、かつ `Date.now() < expiresAt` のとき、その値を返す（`factory` は呼ばない）。
 * - エッジ: エントリが無い、または期限切れのとき `factory()` を 1 回呼び、`expiresAt = Date.now() + ttl` でエントリを置き換え、その値を返す。
 * - 期限切れの境界は `Date.now() < expiresAt` であり、`Date.now() === expiresAt` の瞬間は期限切れ扱い（テストの `vi.advanceTimersByTime(ttl)` がこの境界を踏む）。
 *
 * 【設計の読解】
 * - `ttl` をファクトリ引数として固定し、`get` の引数にしていない。これにより「このキャッシュインスタンスはこの寿命で動く」というポリシーが型として明示され、呼び出し側で `ttl` をバラつかせる事故を防ぐ。
 * - 期限の表現に「絶対時刻 `expiresAt`」を選んでいる（「相対時間 + 取得時刻」ではなく）。判定が `Date.now() < expiresAt` の一発で済み、判定ロジックが取得時刻に依存しない。
 *
 * 【実装上の選択】
 * - 期限切れエントリを `delete` してから `set` するのでなく、`set` で上書きしている。`delete` を挟む実利がなく、Map の操作回数が減るため。
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
