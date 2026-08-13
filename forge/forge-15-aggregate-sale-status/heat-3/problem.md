# [heat-3] フィルタと集約を合成する aggregateSaleStatus

## 背景

`syncColorButtons` / `syncDiameterButtons` / `syncLinesButtons` はすべて `aggregateSaleStatus` を、引数の個数だけ変えて呼ぶ。内部は heat-1 + heat-2 の合成。

## やること

`aggregateSaleStatus` を実装する。heat-1/2 を同ファイルに再実装してもよい。推奨は `filterMatchedSkus` と `pickSaleStatusFromMatches` を呼び出して合成する。

## 受け入れ条件

- 未指定引数は `null` 相当（その軸で絞らない）
- `filterMatchedSkus` → `pickSaleStatusFromMatches` の結果を返す
- `variationSkus` が falsy のとき → `undefined`
- DOM は更新しない

## 型

```ts
function aggregateSaleStatus(
  variationSkus: VariationSku[],
  label?: string | null,
  ballDiameter?: string | null,
  engravingLines?: string | null,
): string | undefined;
```

## 実装者が決めること

受け入れ条件を満たす範囲で、次は任せる。

- heat-1/2 の関数を同ファイルに書くか、このファイル内で再利用するか
- デフォルト引数 `= null` を使うか

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する。JSDoc はチケットを蒸留する（書き方はリポジトリ直下 README）。heat-1/2 が済んでいれば合成に集中する
2. `spec.md` で答え合わせ
3. `npx vitest forge-15-aggregate-sale-status/heat-3` でテストを通す
