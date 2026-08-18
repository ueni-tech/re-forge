# [heat-2] spec.md — 答え合わせ用

**注意: kata.ts を実装してから開くこと。**

## 自分の JSDoc と比較する観点

- capture / apply / syncChecked が **別関数** な理由を、1ヵ月後に読めるか
- 「表示中 block だけ読む／書く」を2文目に書いたか

## 観察ポイント

### モジュールスコープ draft

React state ではなく **ファイル内シングルトン**。combo 初期化1回 + SKU 切替のたび capture する実務パターン。ページ離脱まで draft は生きる。

### 書体 checked の全解除 → 再設定

別 block に残った checked を消さないと、非表示 radio が checked のまま残る。**name が block ごとに同じ** なので、表示 block だけ正しく checked にする前に全体を false にする。

### フォールバックは先頭 input

draft の value が新 block に存在しない（11font → 6font 切替）とき、先頭 checked は **データ上の妥協**。実務では draft 復元後にユーザーが再選択する前提。

### 表示 block の定義

`hidden === false` の最初の1件。複数 visible があれば最初だけ — 実務 HTML では通常1件。
