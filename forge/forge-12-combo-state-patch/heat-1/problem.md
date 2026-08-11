# [heat-1] SKU 行からピッカー用の軸状態を作る

## 実務での使われ方

多軸バリエーション（`listing-variation-combo-entry.ts`）では、ページ初期化時に JSON から `listingCode` に一致する SKU 行を探し、その行の情報を**ピッカーの選択状態**として保持する。

`stateFromSku` は「SKU テーブルの1行 → ピッカーが持つ state オブジェクト」への変換を担う。

## やりたいこと

`VariationSku` の1行を受け取り、`ComboState` を返す `stateFromSku` を実装する。

## 合意済み仕様（この heat で握る挙動）

- 返す `ComboState` には **必ず `label`** を含める（`sku.label` をそのまま使う）
- `sku.ballDiameter` が **truthy** のときだけ `state.ballDiameter` にコピーする
- `sku.engravingLines` が **truthy** のときだけ `state.engravingLines` にコピーする
- **`wrapping` は state に含めない**（この heat の state 組み立てでは扱わない）
- 入力 SKU を変更しない（副作用なし）

## 入出力

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

## あなたが決めること

### truthy 判定

- `ballDiameter: ""` や `engravingLines: "0"` のとき、コピーするか?
- 実務では空文字の軸は「未設定」とみなす。`if (sku.ballDiameter)` でよいか?

### 返却オブジェクトの形

- 未設定の軸は **プロパティ自体を省略** するか、**`undefined` を明示** するか?
- どちらでもテスト上は同等だが、後続の `resolveSku` では「undefined = この軸では絞り込まない」と読む。省略と undefined を混在させない方がよい

### 新規オブジェクト vs ミュータブル

- 毎回新しいオブジェクトを返すか? 呼び出し側が state を保持し続ける前提で、**返却は常に新規** とする

## JSDoc【契約】を書く考え方

| # | 質問 |
|---|------|
| 1 | **正常時** — 各軸が揃った SKU からどんな state が返る？ |
| 2 | **困った入力** — 径・行数が無い SKU、空文字の軸 |
| 3 | **しないこと** — 入力 SKU を変更する？ wrapping をコピーする？ |
| 4 | **暗黙の決め** — truthy 判定、省略 vs undefined |

### この heat への当てはめ（問いのみ）

- **正常時**: label + ballDiameter + engravingLines がある行
- **困った入力**: 径だけ無い行、行数だけ無い行
- **しないこと**: `sku` のプロパティを書き換える？
- **暗黙の決め**: 空文字をコピーするか省略するか

## 進め方

1. このファイルだけ読んで `kata.ts` を実装する
2. 実装が終わったら `spec.md` を開いて自分の判断と突き合わせる
3. `npx vitest forge-12-combo-state-patch/heat-1` でテストを通す
