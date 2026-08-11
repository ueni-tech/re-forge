# [heat-1] 部分指定で SKU 行をフィルタする

## 実務での使われ方

`aggregateSaleStatus` は、ボタンごとに **指定した軸だけ** で SKU を絞る。未指定の軸は `null` を渡し「ワイルドカード」にする。

## やりたいこと

`filterMatchedSkus` を実装する。

## 合意済み仕様（この heat で握る挙動）

各引数が **`null` のとき** → その軸では **絞り込まない**  
**`null` 以外** のとき → 次の条件で **一致必須**:

| 引数 | 一致条件 |
|------|----------|
| `label` | `row.label` が truthy **かつ** `row.label === label` |
| `ballDiameter` | `row.ballDiameter` が truthy **かつ** `row.ballDiameter === ballDiameter` |
| `engravingLines` | `row.engravingLines` が truthy **かつ** `row.engravingLines === engravingLines` |

- すべての指定条件を満たした行だけ返す（**順序は入力配列順を維持**）
- `variationSkus` が falsy のとき → `[]` を返す

## 入出力

```ts
function filterMatchedSkus(
  variationSkus: VariationSku[] | null | undefined,
  label: string | null,
  ballDiameter: string | null,
  engravingLines: string | null,
): VariationSku[];
```

## あなたが決めること

- `filterByX = x != null` フラグを先に立てるか、ループ内で毎回 `if (label != null)` するか
- truthy チェック（`!row.label`）を入れる理由 — 空文字行を除外

## JSDoc【契約】を書く考え方

### この heat への当てはめ（問いのみ）

- **正常時**: label のみ指定、3軸すべて指定
- **困った入力**: 全 null、0件、variationSkus が null
- **しないこと**: saleStatus の集計
- **暗黙の決め**: null vs undefined（引数は null のみ）

## 進め方

1. `problem.md` のみで実装
2. `spec.md` で答え合わせ
3. `npx vitest forge-15-aggregate-sale-status/heat-1`
