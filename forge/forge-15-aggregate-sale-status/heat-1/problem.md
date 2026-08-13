# [heat-1] 部分指定で SKU 行をフィルタする

## 背景

`aggregateSaleStatus` は、ボタンごとに指定した軸だけで SKU を絞る。未指定の軸は `null` を渡し、ワイルドカードにする。

## やること

`filterMatchedSkus` を実装する。

## 受け入れ条件

各引数が `null` のとき → その軸では絞り込まない。  
`null` 以外のとき → 次の条件で一致必須:

| 引数 | 一致条件 |
|------|----------|
| `label` | `row.label` が truthy かつ `row.label === label` |
| `ballDiameter` | `row.ballDiameter` が truthy かつ `row.ballDiameter === ballDiameter` |
| `engravingLines` | `row.engravingLines` が truthy かつ `row.engravingLines === engravingLines` |

- すべての指定条件を満たした行だけ返す（入力配列の順を維持）
- `variationSkus` が falsy のとき → `[]` を返す
- 入力配列は変更しない
- `saleStatus` の集計はこの関数の責務ではない

## 型

```ts
function filterMatchedSkus(
  variationSkus: VariationSku[] | null | undefined,
  label: string | null,
  ballDiameter: string | null,
  engravingLines: string | null,
): VariationSku[];
```

## 実装者が決めること

受け入れ条件を満たす範囲で、次は任せる。

- `x != null` のフラグを先に立てるか、ループ内で毎回判定するか

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する。JSDoc はチケットを蒸留する（書き方はリポジトリ直下 README）
2. `spec.md` で答え合わせ
3. `npx vitest forge-15-aggregate-sale-status/heat-1` でテストを通す
