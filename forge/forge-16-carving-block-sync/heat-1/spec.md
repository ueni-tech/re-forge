# [heat-1] spec.md — 答え合わせ用

**注意: kata.ts を実装してから開くこと。**

受け入れ条件の一次ソースは `problem.md`。

## 自分の JSDoc と比較する観点

- 「SKU 確定時に名入れ block の表示だけ切り替える」と1文で言えているか
- `hidden` と `fieldset.disabled` を両方触る理由（非表示 block の input を無効化）を2文目に書いたか

## 観察ポイント

### `data-listing-codes` は 1 SKU ではなく集合

forge-08 の `data-code`（1対1）とは異なる。**1 block が複数 SKU で共用**されるケースがある（同じ書体セットの色違いなど）。

### `hidden` + `disabled` の二重ガード

CSS だけ隠してもフォーム送信や Tab フォーカスで漏れる。fieldset disabled は **アクセシビリティと validation スキップ** の両方に効く。

### document 全体走査

実務コードは `#order-option-carving` 内に限定していないが、セレクタが block 専用なので実害は小さい。範囲を root に閉じる改善余地はある。
