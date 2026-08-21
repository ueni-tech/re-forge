# [heat-2] spec.md — 答え合わせ用

## 観察ポイント

### Context は RuleStep 用の DTO

入力そのものに加え、**ルールが毎回再計算しなくてよい派生値**（実効上限・allowJapanese 等）を載せる。

### runRules は for + break の最小形

forge-09 の `composeValidators`（全走査）とは異なり **先頭失敗** が UX 上の要件（最初の1エラーだけ見せる）。

### heat-1 との接続

`buildContext` は `fixtures/resolve-ref.ts`（heat-1 解答相当）に依存。シリーズ学習では heat-1 完了後に heat-2 へ。
