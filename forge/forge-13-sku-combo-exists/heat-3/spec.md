# [heat-3] spec.md — 答え合わせ用

**注意: kata.ts を実装してから開くこと。**

## 自分の契約と比較する観点

### 存在判定 vs 収集

| 目的 | 戻り値 | 典型 API |
|------|--------|----------|
| 存在するか | boolean | `.some()` |
| 値を集める | string[] | `.forEach` / `.filter().map()` |

**フィルタ条件は同じ family** から派生する。存在判定が書ければ、収集は「条件を満たす行から値を抜く」に変えるだけ。

### collectLinesForLabelDiameter の径条件（注意）

```ts
if (sku.ballDiameter !== undefined && sku.ballDiameter !== ballDiameter) return;
```

引数 `ballDiameter` が `undefined` のとき、**SKU 側に径がある行はすべてスキップ**される（`"0.7" !== undefined` が true）。

通過するのは **SKU 行の ballDiameter も undefined** のケースだけ。テストデータで確認すること。

### 重複を残す理由

次 forge（forge-14）の `pickMinAxisValue` が重複除去 + ソートを担当。**1関数1責務**で段階学習。

## 観察ポイント

収集ロジックは fallback の前段。ここが曖昧だと fallback 全体が読めなくなる。**データの流れ**を頭の中で:

```
SKU[] → collect* → string[] → pickMin → 1つの値
```

と描けるかがロジック力の指標。
