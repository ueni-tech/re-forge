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
 *  一定時間内なら同じ値を共有し、時間が経ったら次回の get で自動的に
 *  作り直されるキャッシュ。永続化と完全揮発の中間。
 *
 * 【契約】
 *  - Date.now() < expiresAt のとき保存値を返す（factory は呼ばない）
 *  - エントリが無い、または期限切れなら factory() を 1 回呼び保存して返す
 *  - 境界: Date.now() === expiresAt の瞬間は期限切れ扱い
 *
 * 【設計の読解】
 *  - ttl をファクトリ引数に固定し、get の引数にしていない。
 *    「このインスタンスはこの寿命」というポリシーを型で明示し、
 *    呼び出し側で ttl をバラつかせる事故を防ぐ。
 *  - 期限の表現に絶対時刻 expiresAt を選んでいる。判定が
 *    Date.now() < expiresAt の一発で済み、取得時刻に依存しない。
 *
 * 【実装上の選択】
 *  - 期限切れエントリを delete してから set でなく、set で上書き。
 *    delete を挟む実利がなく、Map 操作が 1 回減るため。
 *
 * @template V キャッシュする値の型
 * @param ttl エントリの有効期限（ミリ秒）
 * @returns get を持つ ttlCache オブジェクト
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