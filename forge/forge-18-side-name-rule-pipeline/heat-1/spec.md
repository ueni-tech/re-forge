# [heat-1] spec.md — 答え合わせ用

## 観察ポイント

### lookup は fixture、解決ロジックが題材

`max_length.ts` の写経は不要。**不正組み合わせを例外にする** か `undefined` にするかは実務が前者。

### 実効上限の切替

`hasJapaneseScript` は forge-17 の成果物。1文字でも日本語相当があれば和文上限 — 日英混在 `山田Akiko` は和文上限6が適用される（forge-18 heat-3 で検証）。
