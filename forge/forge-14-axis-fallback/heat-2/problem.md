# [heat-2] 無効な軸選択をカスケードでフォールバックする

## 実務での使われ方

色を変更すると、以前選んでいた径・行数が新しい色では存在しないことがある。`applyAxisFallbacks` は **state をその場で修正** し、有効な組み合わせに寄せる。

## やりたいこと

`applyAxisFallbacks(state, variationSkus)` を実装する。

`kata.ts` には **依存ヘルパーが実装済み** で同梱されている（変更しない）。

## 合意済み仕様（この heat で握る挙動）

処理順は **径 → 行数** の2段。

### 第1段: ballDiameter

- `state.ballDiameter === undefined` のとき → **何もしない**
- それ以外で `hasDiameterForStateColor(state, variationSkus, state.ballDiameter)` が **false** のとき:
  - `pickMinAxisValue(collectDiametersForLabel(variationSkus, state.label))` を求める
  - 結果が `undefined` でなければ `state.ballDiameter` に代入

### 第2段: engravingLines

- `state.engravingLines === undefined` のとき → **何もしない**
- それ以外で `hasLinesForStateColorDiameter(state, variationSkus, state.engravingLines)` が **false** のとき:
  - `pickMinAxisValue(collectLinesForLabelDiameter(variationSkus, state.label, state.ballDiameter))` を求める
  - 結果が `undefined` でなければ `state.engravingLines` に代入

### 共通

- 戻り値 `void`（state をミュート）
- フォールバック候補が無いときは **その軸は変更しない**

## 入出力

```ts
function applyAxisFallbacks(state: ComboState, variationSkus: VariationSku[]): void;
```

## あなたが決めること

- 2段の処理を **同型のブロック** として書けるか（コピペ2回 vs 抽象化）
- 径フォールバック後に行数判定する **順序固定** の理由（径が変わると行数の有効集合も変わる）

## JSDoc【契約】を書く考え方

### この heat への当てはめ（問いのみ）

- **正常時**: 有効な選択のまま変化なし
- **困った入力**: 色変更後に径だけ無効、行数だけ無効、両方無効
- **しないこと**: resolveSku を呼ぶ？ 新 state を返す？
- **暗黙の決め**: 候補なし時は据え置き

## 進め方

1. `problem.md` と `kata.ts` のヘルパーを読んで `applyAxisFallbacks` だけ実装
2. `spec.md` で答え合わせ
3. `npx vitest forge-14-axis-fallback/heat-2`
