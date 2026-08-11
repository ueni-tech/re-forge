# [heat-3] SKU テーブルから軸候補値を収集する

## 実務での使われ方

`applyAxisFallbacks` は、現在の選択が無効なとき **同じ色で取りうる径の一覧** や **色×径で取りうる行数の一覧** から最小値を選ぶ。その前段として SKU テーブルを走査して値を集める。

## やりたいこと

次の2関数を実装する。

1. `collectDiametersForLabel(variationSkus, label)` — 指定色の SKU 行から `ballDiameter` を集める
2. `collectLinesForLabelDiameter(variationSkus, label, ballDiameter)` — 指定色（と径）の SKU 行から `engravingLines` を集める

## 合意済み仕様（この heat で握る挙動）

### collectDiametersForLabel

- `sku.label === label` かつ `sku.ballDiameter` が **truthy** の行だけ対象
- 対象行の `ballDiameter` を **出現順に** 配列に push（重複除去は **しない** — 次 heat で行う）

### collectLinesForLabelDiameter

- `sku.label !== label` の行はスキップ
- `sku.ballDiameter !== undefined` **かつ** `sku.ballDiameter !== ballDiameter` の行はスキップ
- `sku.engravingLines` が **truthy** の行だけ `engravingLines` を push
- `ballDiameter` 引数が `undefined` のとき:
  - `sku.ballDiameter !== undefined && sku.ballDiameter !== ballDiameter` の **左辺が false** になる行だけ径条件を通過（= **SKU 側で径が未設定の行**）
  - `sku.ballDiameter` が設定済みの行は `!== undefined` が true になり、第2項 `"0.7" !== undefined` も true のため **スキップされる**
  - 実務では `applyAxisFallbacks` 第2段の時点で `state.ballDiameter` は通常設定済み

## 入出力

```ts
function collectDiametersForLabel(
  variationSkus: VariationSku[],
  label: string,
): string[];

function collectLinesForLabelDiameter(
  variationSkus: VariationSku[],
  label: string,
  ballDiameter: string | undefined,
): string[];
```

## あなたが決めること

- 存在判定（heat-1/2）と **同じフィルタ条件** を再利用できるか?
- 重複をこの heat で除去するか、次 forge に任せるか（仕様は **重複あり**）
- `forEach` + `return` でスキップ vs `filter` + `map` の2段

## JSDoc【契約】を書く考え方

### この heat への当てはめ（問いのみ）

- **正常時**: 複数行から径・行数が集まる
- **困った入力**: 該当行0件、径 undefined 指定
- **しないこと**: ソート、重複除去
- **暗黙の決め**: truthy な軸値だけ集める

## 進め方

1. `problem.md` のみで実装
2. `spec.md` で答え合わせ
3. `npx vitest forge-13-sku-combo-exists/heat-3`
