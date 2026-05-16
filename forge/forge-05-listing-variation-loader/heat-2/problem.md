# [heat-2] クエリパラメータの上書きと goods-image-variations 用 URL マップ生成

## 実務での使われ方

商品詳細ページが `?listing-code=ST-TKV-A1` で開かれたとき、`variationSkus` に含まれるコードなら初期表示コードを上書きし(無効なら無視)、さらに各コードから `data-goods-image-variations` 用の URL マップを作る。どちらも「JSON 読み込み後・ページ出力前」に挟まる純粋変換ステップ。

このheatでは**2つの関数**を実装する。

---

## 関数1: applyListingCodeParam

### やりたいこと

URL クエリで要求されたコードが**有効なバリエーション**かをチェックし、有効なら採用、無効なら初期コードのままにする。

### 入出力

```ts
function applyListingCodeParam(
  variationSkus: VariationSku[],
  defaultCode: string,
  requestedCode: string | null | undefined,
): string
```

- **variationSkus**: 有効なバリエーションコードの一覧
- **defaultCode**: JSON 由来の初期コード
- **requestedCode**: URL クエリパラメータから取得したコード
- **戻り値**: 最終的に採用するコード

### あなたが決めること

- `requestedCode` が `null` / `undefined` / 空文字のときは?
- `requestedCode` が `variationSkus` のどの code とも一致しないときは?
- コードの一致は完全一致? 前後スペースは許容する?(trim する?)

---

## 関数2: buildGoodsImageVariationsMap

### やりたいこと

各バリエーションコードに対応する画像ページの URL を組み立てて、コード→URL情報のマップを作る。

### 入出力

```ts
function buildGoodsImageVariationsMap(
  variationSkus: VariationSku[],
  baseUrl: string,
): Record<string, { path: string }>
```

- **variationSkus**: バリエーション SKU の一覧
- **baseUrl**: URL のベースパス(末尾スラッシュあり、例: `"https://www.hankoya.com/shop/item/sample/"`)
- **戻り値**: `code` をキー、`{ path: ベースURL + code + ".html" }` を値とするマップ

### あなたが決めること

- `variationSkus` が空配列のときは?
- `code` が空文字のエントリがあったらどうする?
- 同じ `code` が複数あったら?(問題文には書いていない)
- `baseUrl` の末尾スラッシュが**ない**場合は?(問題文には「ある前提」と書いた)

## 進め方

1. このファイルだけ読んで `kata.ts` を実装する
2. 実装が終わったら `spec.md` を開いて自分の判断と突き合わせる
3. `npx vitest` でテストを通す
