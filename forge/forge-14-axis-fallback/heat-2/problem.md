# [heat-2] 無効な軸選択をカスケードでフォールバックする

## 背景

色を変更すると、以前選んでいた径・行数が新しい色では存在しないことがある。`applyAxisFallbacks` は state をその場で修正し、有効な組み合わせに寄せる。

`kata.ts` には依存ヘルパーが実装済み。変更しない。

## やること

`applyAxisFallbacks(state, variationSkus)` を実装する。

## 受け入れ条件

処理順は **径 → 行数** の2段。

### 第1段: ballDiameter

- `state.ballDiameter === undefined` のとき → 何もしない
- それ以外で `hasDiameterForStateColor(state, variationSkus, state.ballDiameter)` が false のとき:
  - `pickMinAxisValue(collectDiametersForLabel(variationSkus, state.label))` を求める
  - 結果が `undefined` でなければ `state.ballDiameter` に代入

### 第2段: engravingLines

- `state.engravingLines === undefined` のとき → 何もしない
- それ以外で `hasLinesForStateColorDiameter(state, variationSkus, state.engravingLines)` が false のとき:
  - `pickMinAxisValue(collectLinesForLabelDiameter(variationSkus, state.label, state.ballDiameter))` を求める
  - 結果が `undefined` でなければ `state.engravingLines` に代入

### 共通

- 戻り値は `void`。渡された `state` をその場で書き換える
- フォールバック候補が無いときは、その軸は変更しない
- `resolveSku` は呼ばない

## 型

```ts
function applyAxisFallbacks(state: ComboState, variationSkus: VariationSku[]): void;
```

## 実装者が決めること

受け入れ条件を満たす範囲で、次は任せる。

- 2段を同型のブロックとして並べるか、共通化するか
- 径を直してから行数を見る順序を、なぜ入れ替えてはいけないか（仮説でよい）

## 進め方

1. このチケットと `kata.ts` のヘルパーを読んで `applyAxisFallbacks` だけ実装する。JSDoc はチケットを蒸留する（書き方はリポジトリ直下 README）
2. `spec.md` で答え合わせ
3. `npx vitest forge-14-axis-fallback/heat-2` でテストを通す
