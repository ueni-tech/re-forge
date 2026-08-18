# [heat-3] spec.md — 答え合わせ用

**注意: kata.ts を実装してから開くこと。**

## 自分の JSDoc と比較する観点

- orchestrator の JSDoc に **順序** を書きすぎていないか（順序は problem の受け入れ条件、JSDoc は「SKU 切替時に名入れ UI 全体を同期する」で足りる）
- `syncCarvingFontLabel` を単体 export する理由（combo 外からもラベルだけ更新したい将来）を考えたか

## 観察ポイント

### capture が block 切替 **より先**

切替後に capture すると **新 block の空値** で draft が上書きされる。順序バグは E2E で「入力が消えた」としか見えない。**オーケストレーターで順序を固定**する典型例。

### ラベルは document 全体

`.js-carving-font-label` は注文オプション列とプレビュー列の **両方** に存在する。`querySelectorAll` で一括更新（A-1-2 のプレビュー連動の一部）。

### initCarvingDraftListeners は範囲外

ユーザー入力のたび capture するリスナー登録は heat-3 では実装しない。combo 初期化時に別途呼ぶ（実務の `initCarvingDraftListeners`）。

### 実務への接続

`listing-variation-combo-entry.ts` の `applyResolvedSelection` 末尾で `applyCarvingSyncForListingCode(sku.code)` が呼ばれる。heat-3 完了後にその1行を読むと A-1 全体の配線が繋がる。
