# [heat-1] spec.md — 答え合わせ用

**注意: kata.ts を実装してから開くこと。**

受け入れ条件の一次ソースは `problem.md`。

## 自分の JSDoc と比較する観点

- 「名入れの入力文字列だけを見て〜を判定する」と DOM 非依存であることが1文目から読めるか
- `isOverMaxLength` が「超えたら true」であること（ちょうど上限は OK）を型では表せないので、必要なら2文目に書いたか

## 観察ポイント

### 判定器は boolean のみ返す

forge-18 の RuleStep が `{ ok, message }` を担う。heat-1 は **検出だけ** に徹し、メッセージは持たない。

### `trim()` と `\s`

`hasLeadingOrTrailingSpace` は `value !== value.trim()` が実務と同じ。`\s` は Unicode 空白も含むが、名入れでは半角・全角スペースが主題。

### 空白のみ入力

heat-1 では未入力扱いにしない。空チェックは `isEmpty` の責務。forge-18 の `empty` ルールが空文字のみを見る。
