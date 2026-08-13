# [heat-2] TTL 付きキャッシュ

## 背景

API レスポンスや権限情報など、しばらくは再利用したいが永続キャッシュにはしたくないデータがある。heat-1 のキャッシュに時間軸を足す。

## やること

指定ミリ秒経過後にエントリが無効になる `createTTLCache` を実装する。`delete` は公開しない。期限管理はキャッシュ自身の責任。

## 受け入れ条件

- `get(key, factory)`: TTL 内なら `factory` を再実行せず、保存値を返す
- 未キャッシュ、または期限切れなら `factory()` を1回呼び、結果を保存して返す
- `Date.now()` が期限と一致する瞬間は **期限切れ** として扱う
- 別キーの期限は独立している
- `delete` は外部に公開しない

## 型

```ts
function createTTLCache<V>(ttl: number): {
  get: (key: string, factory: () => V) => V;
};
```

`ttl` はエントリの有効期限（ミリ秒）。実装では `Date.now()` を使ってよい。テストは Vitest の fake timers で時刻を進める。

## 実装者が決めること

受け入れ条件を満たす範囲で、次は任せる。

- 「いつ作られたか」を保存するか、「いつ切れるか」を保存するか
- なぜ `ttl` を `createTTLCache(ttl)` に固定し、`get` の引数にしていないか（仮説でよい）

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する。JSDoc はチケットを蒸留する（書き方はリポジトリ直下 README）
2. `spec.md` で答え合わせ
3. `npx vitest forge/_sample/heat-2` でテストを通す
