# [heat-3] spec.md — 答え合わせ用

## 観察ポイント

### syncValidationState と forge-16

`carving-blocks:synced` 後に呼ばれる想定。block の hidden/disabled が変わったあと **Map と表示を再同期** する。

### buildValidationInput は adapter の最小形

実務 `pdp_build_validation_input.ts` は visible block 優先など追加がある。パターン理解後に diff を取る。

### 統合チェックリスト

- [ ] `createSideNameValidation.ts`
- [ ] `ui/adapters/pdp_build_validation_input.ts`
- [ ] `ui/adapters/pdp.ts`（boot + event）
- [ ] 実務テストとの diff
