# [heat-1] 色 × ボール径の組み合わせが存在するか判定する

## 実務での使われ方

`syncDiameterButtons` は各径ボタンについて「今選んでいる色と、この径の組み合わせが SKU テーブルに存在するか」を調べ、無ければ `hidden` にする。

## やりたいこと

`hasDiameterForStateColor(state, variationSkus, ballDiameter)` を実装する。

## 合意済み仕様（この heat で握る挙動）

- `variationSkus` の **いずれか1行** が次を満たせば `true`:
  - `sku.label === state.label`
  - `sku.ballDiameter === ballDiameter`（**厳密等価**、`null` も許容）
- 1件も無ければ `false`
- 空配列は `false`

## 入出力

```ts
type ComboState = { label: string; ballDiameter?: string; engravingLines?: string };

function hasDiameterForStateColor(
  state: ComboState,
  variationSkus: VariationSku[],
  ballDiameter: string | null,
): boolean;
```

## あなたが決めること

- `some` と `filter().length > 0` のどちらを使うか
- `state.ballDiameter` は **この関数では参照しない**（第3引数の `ballDiameter` だけ見る）。なぜ引数を分けるか?

## JSDoc【契約】を書く考え方

| # | 質問 |
|---|------|
| 1 | **正常時** — 存在する組み合わせ |
| 2 | **困った入力** — 空配列、`ballDiameter: null` |
| 3 | **しないこと** — state を変更、例外 |
| 4 | **暗黙の決め** — 厳密等価 |

### この heat への当てはめ（問いのみ）

- **正常時**: 赤 × 0.7 がテーブルにある
- **困った入力**: 別の色の径だけ存在、空配列
- **しないこと**: `state.ballDiameter` で絞る？
- **暗黙の決め**: `undefined` 径の SKU 行とのマッチ

## 進め方

1. `problem.md` のみで実装
2. `spec.md` で答え合わせ
3. `npx vitest forge-13-sku-combo-exists/heat-1`
