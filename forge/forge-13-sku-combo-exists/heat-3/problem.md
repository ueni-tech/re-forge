# [heat-3] SKU テーブルから軸候補値を収集する

## 背景

`applyAxisFallbacks` は、現在の選択が無効なとき、同じ色で取りうる径や、色×径で取りうる行数の一覧から最小値を選ぶ。その前段として SKU テーブルを走査して値を集める。

## やること

次の2関数を実装する。

1. `collectDiametersForLabel(variationSkus, label)` — 指定色の行から `ballDiameter` を集める
2. `collectLinesForLabelDiameter(variationSkus, label, ballDiameter)` — 指定色（と径）の行から `engravingLines` を集める

## 受け入れ条件

### collectDiametersForLabel

- `sku.label === label` かつ `sku.ballDiameter` が truthy の行だけ対象
- 対象行の `ballDiameter` を **出現順** に配列へ入れる
- 重複除去はしない（次の forge で行う）
- ソートしない

### collectLinesForLabelDiameter

- `sku.label !== label` の行はスキップ
- `sku.ballDiameter !== undefined` かつ `sku.ballDiameter !== ballDiameter` の行はスキップ
- `sku.engravingLines` が truthy の行だけ push
- `ballDiameter` 引数が `undefined` のとき、SKU 側で径が未設定の行だけ径条件を通過する（径が設定済みの行はスキップ）

## 型

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

## 実装者が決めること

受け入れ条件を満たす範囲で、次は任せる。

- heat-1/2 の存在判定と同じフィルタ条件を再利用できるか
- `forEach` + 早期 return か、`filter` + `map` の2段か

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する。JSDoc はチケットを蒸留する（書き方はリポジトリ直下 README）
2. `spec.md` で答え合わせ
3. `npx vitest forge-13-sku-combo-exists/heat-3` でテストを通す
