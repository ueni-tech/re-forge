# [heat-1] SKU 行からピッカー用の軸状態を作る

## 背景

多軸バリエーション（`listing-variation-combo-entry.ts`）は、ページ初期化時に JSON から `listingCode` に一致する SKU 行を探し、その行を **ピッカーの選択状態** として持つ。

`stateFromSku` は「SKU テーブルの1行 → ピッカーが持つ state」への変換。

## やること

`stateFromSku(sku)` を実装する。

## 受け入れ条件

- 返す `ComboState` には必ず `label` を含める（`sku.label` をそのまま使う）
- `sku.ballDiameter` が truthy のときだけ `state.ballDiameter` にコピーする
- `sku.engravingLines` が truthy のときだけ `state.engravingLines` にコピーする
- `wrapping` は state に載せない
- 入力の `sku` は変更しない
- 毎回 **新しいオブジェクト** を返す

## 型

```ts
type VariationSku = {
  code: string;
  label: string;
  ballDiameter?: string;
  engravingLines?: string;
  wrapping?: string;
  saleStatus: number;
};

type ComboState = {
  label: string;
  ballDiameter?: string;
  engravingLines?: string;
  wrapping?: string;
};

function stateFromSku(sku: VariationSku): ComboState;
```

## 実装者が決めること

受け入れ条件を満たす範囲で、次は任せる。

- 未設定の軸はプロパティごと省略するか、`undefined` を明示するか（混在は避ける）
- truthy 判定で `""` と `"0"` がどうなるかは、受け入れ条件の「truthy のときだけ」に従う

## 進め方

1. このチケットだけ読んで `kata.ts` を実装する。JSDoc はチケットを蒸留する（書き方はリポジトリ直下 README）
2. `spec.md` で答え合わせ
3. `npx vitest forge-12-combo-state-patch/heat-1` でテストを通す
