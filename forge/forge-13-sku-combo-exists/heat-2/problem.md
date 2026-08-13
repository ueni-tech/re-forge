# [heat-2] 色 × 径 × 行数の組み合わせが存在するか判定する

## 背景

`syncLinesButtons` は行数ボタンごとに `hasLinesForStateColorDiameter` を呼び、存在しない行数を非表示にする。

## やること

`hasLinesForStateColorDiameter(state, variationSkus, engravingLines)` を実装する。

## 受け入れ条件

次をすべて満たす行が1件でもあれば `true`。0件なら `false`。

- `sku.label === state.label`
- 径:
  - `state.ballDiameter === undefined` のとき → 径は問わない
  - それ以外 → `sku.ballDiameter === state.ballDiameter`（厳密等価）
- `sku.engravingLines === engravingLines`（第3引数。厳密等価。`null` 可）
- `state` は変更しない
- 行数は `state.engravingLines` ではなく第3引数だけを見る

## 型

```ts
function hasLinesForStateColorDiameter(
  state: ComboState,
  variationSkus: VariationSku[],
  engravingLines: string | null,
): boolean;
```

型定義は kata.ts を参照。

## 実装者が決めること

受け入れ条件を満たす範囲で、次は任せる。

- 径条件を if 分岐で書くか、1つの boolean 式にまとめるか

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する。JSDoc はチケットを蒸留する（書き方はリポジトリ直下 README）
2. `spec.md` で答え合わせ
3. `npx vitest forge-13-sku-combo-exists/heat-2` でテストを通す
