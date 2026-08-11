# [heat-3] spec.md — 答え合わせ用

**注意: kata.ts を実装してから開くこと。**

## 仕様の一次ソース

合意済み仕様は `problem.md` が一次ソース。

## 自分の契約と比較する観点

### optional 軸 = フィルタ省略

`state.ballDiameter === undefined` のとき径で絞らない。これにより **「label だけ指定して候補を探す」** ような使い方も可能（テストでは主に全軸指定）。

実務では `stateFromSku` 後は通常全軸が載る。色変更時は `patchState` で label だけ変え、**無効な組み合わせの修正は `applyAxisFallbacks` が別途担当**。

### find + 早期 return false

```ts
return variationSkus.find((sku) => {
  if (sku.label !== state.label) return false;
  if (state.ballDiameter !== undefined && sku.ballDiameter !== state.ballDiameter) return false;
  // ...
  return true;
});
```

**軸ごとに1条件ずつ**並べると、新しい軸追加時に1行足すだけで済む。ネストした `&&` より読みやすいことが多い。

### 複数マッチは先頭

データ上は code ごとに行が分かれており、同一 state に複数行は通常ない。`find` の「最初」で十分。**仕様を単純に保つ**判断。

## 観察ポイント: 検索ロジックの分解

```
必須: label 一致
任意: ballDiameter が state にあれば一致必須
任意: engravingLines が state にあれば一致必須
任意: wrapping が state にあれば一致必須
```

**必須条件と optional 条件を混在させる**とき、「undefined = 条件なし」という convention をチームで統一することが重要。
