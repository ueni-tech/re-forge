# [heat-3] 軸状態から SKU 行を確定する

## 背景

`applyResolvedSelection` は state を更新したあと `resolveSku(state, variationSkus)` で **SKU を1行に確定**し、`sku.code` を listingCode として共有コアに渡す。

## やること

`resolveSku(state, variationSkus)` を実装する。条件に一致する **最初の1行** を返す。

## 受け入れ条件

- `sku.label` は常に `state.label` と一致すること（必須）
- `state.ballDiameter` が `undefined` でないとき、`sku.ballDiameter` も一致すること
- `state.engravingLines` が `undefined` でないとき、`sku.engravingLines` も一致すること
- `state.wrapping` が `undefined` でないとき、`sku.wrapping` も一致すること
- 一致 0件 → `undefined`
- 一致が複数件 → 配列の先頭
- `state` は書き換えない

## 型

```ts
function resolveSku(
  state: ComboState,
  variationSkus: VariationSku[],
): VariationSku | undefined;
```

型定義は kata.ts を参照。

## 実装者が決めること

受け入れ条件を満たす範囲で、次は任せる。

- 条件の書き方（`find` + 早期 `return false` か、1行の比較か）
- state に無い軸を「その軸では絞らない」と読むことと、色変更直後に古い径が残ることの関係。無効組み合わせの修正は、この関数の外（フォールバック）の責務でよいか

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する。JSDoc はチケットを蒸留する（書き方はリポジトリ直下 README）
2. `spec.md` で答え合わせ
3. `npx vitest forge-12-combo-state-patch/heat-3` でテストを通す
