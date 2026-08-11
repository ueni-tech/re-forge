# [heat-3] フィルタと集約を合成する aggregateSaleStatus

## 実務での使われ方

`syncColorButtons` / `syncDiameterButtons` / `syncLinesButtons` はすべて `aggregateSaleStatus` を **引数の個数だけ変えて** 呼ぶ。内部は heat-1 + heat-2 の合成。

## やりたいこと

`aggregateSaleStatus` を実装する。

heat-1/2 を **同ファイル内に再実装してもよい** が、推奨は `filterMatchedSkus` と `pickSaleStatusFromMatches` を **呼び出して合成** する。

## 合意済み仕様（この heat で握る挙動）

```ts
function aggregateSaleStatus(
  variationSkus: VariationSku[],
  label?: string | null,
  ballDiameter?: string | null,
  engravingLines?: string | null,
): string | undefined;
```

- 未指定引数は **`null` 相当**（その軸で絞らない）
- `filterMatchedSkus` → `pickSaleStatusFromMatches` の結果を返す
- `variationSkus` が falsy のとき → `undefined`

## あなたが決めること

- heat-1/2 の関数を **import せず同ファイルに書く** か **再利用** か
- デフォルト引数 `= null` を使うか

## JSDoc【契約】を書く考え方

### この heat への当てはめ（問いのみ）

- **正常時**: 色だけ / 色×径 / 全軸
- **困った入力**: 0件マッチ、falsy skus
- **しないこと**: DOM 更新
- **暗黙の決め**: 合成の順序

## 進め方

1. `problem.md` のみで実装（heat-1/2 完了済みなら合成に集中）
2. `spec.md` で答え合わせ
3. `npx vitest forge-15-aggregate-sale-status/heat-3`
