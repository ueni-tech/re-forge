# [heat-1] 色 × ボール径の組み合わせが存在するか判定する

## 背景

`syncDiameterButtons` は各径ボタンについて「今選んでいる色と、この径の組み合わせが SKU テーブルに存在するか」を調べ、無ければ `hidden` にする。

## やること

`hasDiameterForStateColor(state, variationSkus, ballDiameter)` を実装する。

## 受け入れ条件

- `variationSkus` のいずれか1行が次を満たせば `true`
  - `sku.label === state.label`
  - `sku.ballDiameter === ballDiameter`（厳密等価。`null` も許容）
- 1件も無ければ `false`
- 空配列は `false`
- `state` は変更しない
- この関数は `state.ballDiameter` を見ない。径は第3引数だけを見る

## 型

```ts
type ComboState = { label: string; ballDiameter?: string; engravingLines?: string };

function hasDiameterForStateColor(
  state: ComboState,
  variationSkus: VariationSku[],
  ballDiameter: string | null,
): boolean;
```

`VariationSku` は kata.ts を参照。

## 実装者が決めること

受け入れ条件を満たす範囲で、次は任せる。

- `some` と `filter().length > 0` のどちらを使うか
- なぜ `state.ballDiameter` ではなく第3引数で径を渡すか（仮説でよい）

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する。JSDoc はチケットを蒸留する（書き方はリポジトリ直下 README）
2. `spec.md` で答え合わせ
3. `npx vitest forge-13-sku-combo-exists/heat-1` でテストを通す
