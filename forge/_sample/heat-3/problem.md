# [heat-3] 非同期キャッシュローダー

## 背景

タブやフィルタごとにデータを fetch しつつ、一度取れた結果はメモリに載せて再訪問時は同期的に返す。許可キー以外は無視する。保存先（`storage`）と取得手段（`fetcher`）は外から注入し、テストと本番で差し替える。

## やること

許可されたキーだけを対象に load するファクトリ `createAsyncCacheLoader` を実装する。

## 受け入れ条件

- `validKeys` に含まれないキー: **何もしない**（callback / storage / fetcher を触らない。例外も投げない）
- キャッシュヒット: fetcher を呼ばず、`callback(value)` を **同期で** 1回呼ぶ
- キャッシュミス: fetcher を呼び、完了時に `storage.set` してから `callback(result)` を 1回呼ぶ
- 2回目以降のヒットでは fetcher を呼ばない
- `fetcher` 未指定時は `fakeFetch` を使う

## 型

```ts
type Storage = {
  get: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
};

function createAsyncCacheLoader(
  storage: Storage,
  validKeys: string[],
  fetcher?: typeof fakeFetch,
): (key: string, delay: number, callback: (result: string) => void) => void;
```

## 実装者が決めること

受け入れ条件を満たす範囲で、次は任せる。

- ヒット時を同期にしたとき、ミス時は非同期になる。呼び出し側から見て予測しにくくなる点をどう見るか
- `storage` / `fetcher` / `validKeys` の渡し方が違う理由（必須か、デフォルト値か、ファクトリ引数か）

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する。JSDoc はチケットを蒸留する（書き方はリポジトリ直下 README）
2. `spec.md` で答え合わせ
3. `npx vitest forge/_sample/heat-3` でテストを通す
