# [heat-2] 部分更新パッチで軸状態を更新する

## 背景

多軸ピッカーは、ボタンクリックのたびに **同じ state オブジェクト** を更新し続ける（`listing-variation-combo-entry.ts`）。React の setState のように新しいオブジェクトを返すのではなく、ミュータブルに書き換える。

呼び出し側は `patchState(state, { ballDiameter })` のように、**変えたい軸だけ** を渡す。

## やること

`patchState(state, patch)` を実装する。

## 受け入れ条件

- パッチの値が `undefined` のキーはスキップする（既存値を維持する）
- `undefined` 以外（空文字 `""` を含む）は、そのキーを state に書き込む
- パッチに無いキーは変更しない
- 戻り値は `void`。渡された `state` をその場で書き換える（新しいオブジェクトは返さない）

## 型

```ts
function patchState(state: ComboState, patch: Partial<ComboState>): void;
```

`ComboState` は kata.ts を参照。

## 実装者が決めること

受け入れ条件を満たす範囲で、次は任せる。

- キーの適用は `Object.keys(patch)` で回すか、固定キーを列挙するか
- `Object.keys` にする場合、TypeScript の書き込みでキャストが必要になることがある

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する。JSDoc はチケットを蒸留する（書き方はリポジトリ直下 README）
2. `spec.md` で答え合わせ
3. `npx vitest forge-12-combo-state-patch/heat-2` でテストを通す
