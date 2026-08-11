# [heat-1] spec.md — 答え合わせ用

**注意: kata.ts を実装してから開くこと。**

## 自分の契約と比較する観点

### parseFloat + NaN → Infinity

```ts
function parseAxisSortValue(value: string): number {
  const n = parseFloat(value);
  return isNaN(n) ? Number.POSITIVE_INFINITY : n;
}
```

数値でないラベルが混ざっても **落ちない**。比較可能なものだけ先頭に来る。

### 重複除去とソートの順序

1. 重複除去（出現順保持）
2. ソート
3. 先頭取得

**代表値選択**の定石パイプライン。

## 観察ポイント

この関数は **純粋関数**。副作用なし。forge-12 の `patchState` や heat-2 の `applyAxisFallbacks` との対比で、「どこまで純粋に切り出せるか」を意識する。
