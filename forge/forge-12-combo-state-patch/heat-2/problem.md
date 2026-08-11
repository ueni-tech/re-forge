# [heat-2] 部分更新パッチで軸状態を更新する

## 実務での使われ方

ピッカーボタンクリック時、`listing-variation-combo-entry.ts` は `patchState(state, { ballDiameter })` のように **同じ state オブジェクトを更新し続ける**。

React の setState とは違い、ミュータブルな state を使う。パッチで「変えたい軸だけ」を渡す。

## やりたいこと

`ComboState` と部分更新オブジェクト `Partial<ComboState>` を受け取り、**state をその場で更新する** `patchState` を実装する。

## 合意済み仕様（この heat で握る挙動）

- パッチの各キーについて、値が **`undefined` のときはスキップ**（既存値を維持）
- 値が **`undefined` 以外**（空文字 `""` を含む）のとき、そのキーを state に書き込む
- 戻り値は **`void`**（state をミュートする）
- パッチに無いキーは変更しない

## 入出力

```ts
function patchState(state: ComboState, patch: Partial<ComboState>): void;
```

## あなたが決めること

### undefined vs 省略

- `patchState(state, { ballDiameter: undefined })` は径を消すのか、維持するのか?
- 合意仕様は **スキップ = 維持**。「軸を消したい」要件は別 API が必要

### ループの書き方

- `Object.keys(patch)` を回すか、固定キーを列挙するか?
- 動的に回すと将来 `ComboState` にキーが増えても追随できる

### 型安全な書き込み

- `(state as Record<...>)[key] = value` のようなキャストが必要になることがある。なぜか?

## JSDoc【契約】を書く考え方

| # | 質問 |
|---|------|
| 1 | **正常時** — パッチ1キー更新後、他キーはどうなる？ |
| 2 | **困った入力** — 空パッチ、`undefined` 値、空文字の値 |
| 3 | **しないこと** — 新オブジェクトを返す？ 例外を投げる？ |
| 4 | **暗黙の決め** — undefined スキップ、空文字は上書き |

### この heat への当てはめ（問いのみ）

- **正常時**: `{ label: "赤" }` に `{ ballDiameter: "0.7" }` を当てる
- **困った入力**: `{ ballDiameter: undefined }`、空パッチ `{}`
- **しないこと**: state の参照を差し替える？
- **暗黙の決め**: 空文字 `"0.5"` は有効な更新か

## 進め方

1. このファイルだけ読んで `kata.ts` を実装する
2. `spec.md` で答え合わせ
3. `npx vitest forge-12-combo-state-patch/heat-2` でテストを通す
