# [heat-3] spec.md — 答え合わせ用

**注意: kata.ts を実装してから開くこと。**

## 自分の契約と比較する観点

### 合成の形

```ts
export function aggregateSaleStatus(...): string | undefined {
  if (!variationSkus) return undefined;
  const matched = filterMatchedSkus(variationSkus, label ?? null, ...);
  return pickSaleStatusFromMatches(matched);
}
```

**パイプライン** として読める。実務の1関数120行を、この3段に分けられた状態。

### 実コードとの対応

hankoya の `aggregateSaleStatus` はフィルタと集約が1関数に同居。リファクタ後は heat-1/2 に相当する塊を切り出せる。**読むときの地図** として re-forge が機能する。

## 観察ポイント: ロジック実装力 = 分解と合成

今回の combo 系で繰り返し現れるパターン:

1. **状態** (forge-12)
2. **存在 / 収集** (forge-13)
3. **修正** (forge-14)
4. **集約** (forge-15)

エントリ (`combo-entry.ts`) はこれらを **順序付きで呼ぶ** だけ。ロジックの難所はすべて logic 側に集約されている。
