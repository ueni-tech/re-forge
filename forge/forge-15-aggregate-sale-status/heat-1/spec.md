# [heat-1] spec.md — 答え合わせ用

**注意: kata.ts を実装してから開くこと。**

## 自分の契約と比較する観点

### `null` = ワイルドカード

`undefined` ではなく **`null` を「絞らない」シグナル** にしている。呼び出し側は `aggregateSaleStatus(skus, btnLabel)` のように **第2引数だけ渡し、残りは default null**。

### truthy チェック付き一致

`!row.label || row.label !== label` — 空ラベル行を、label 指定フィルタ時に除外。**データ欠損行を結果に混ぜない** 防御。

### フラグを先に立てる

```ts
const filterByLabel = label != null;
```

ループ内の条件が読みやすくなる。**可変フィルタ** の定番パターン。

## 観察ポイント

この関数だけなら **純粋**。UI の「どのボタンにどの引数を渡すか」と分離できる。
