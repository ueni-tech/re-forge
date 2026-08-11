# [heat-2] spec.md — 答え合わせ用

**注意: kata.ts を実装してから開くこと。**

## 自分の契約と比較する観点

### optional な state.ballDiameter

行数ボタン同期時、state には通常 `ballDiameter` が載っている。ただし API として **undefined なら径で絞らない** と決めておくと、heat-1 との convention が揃う。

実コード:

```ts
(state.ballDiameter === undefined || sku.ballDiameter === state.ballDiameter)
```

**「条件なし OR 一致」** の定番形。

### 第3引数はボタンの data 属性

heat-1 と同様、ループ中の候補行数を渡す。state.engravingLines は「現在選択」。

## 観察ポイント: 条件の積み上げ

存在判定は heat-1 より条件が1つ増えるだけ。パターンは同じ:

```
label 必須一致
+ optional 軸（state 側 undefined でスキップ）
+ 引数で渡された候補値との一致
```

この型を頭に置くと、次の heat（収集）も同じフィルタの形で書ける。
