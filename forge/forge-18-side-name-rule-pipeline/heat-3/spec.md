# [heat-3] spec.md — 答え合わせ用

## 観察ポイント

### ルールセットはデータ

`ENGRAVING_TEXT_RULE_SET` は **宣言的な配列**。新ルール追加は配列に1行足すだけ（Open/Closed）。

### メッセージの static / dynamic

`japaneseNotAllowedForFont` と `overMaxLength` は Context 依存。文字列固定では表現できない。

### forge-09 との対比

| | forge-09 | forge-18 |
|---|---|---|
| 合成 | composeValidators | RuleStep[] + runRules |
| 打ち切り | 戦略として選択 | 常に先頭失敗 |
| 条件付き | when スキーマ | Context 派生値 |

### 統合

heat-3 完了 → `side_name_validation.ts` + `rules.ts` として実務 repo に配置。
