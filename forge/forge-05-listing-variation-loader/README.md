# forge-05-listing-variation-loader — バリエーション JSON の読み込み・クエリ適用・URL マップ生成

業務リポジトリ（hankoya）の **`_packages/lib/shop_item/listing_variation.inc`** から、
**JSON エントリの検索**・**クエリパラメータによる初期コード上書き**・**data-goods-image-variations 用 URL マップ生成**・**オーケストレーション** の 4 処理を切り出した forge です。

元の実装は PHP ですが、純粋な変換ロジックは TS で再現できます。  
DOM・サーバー固有処理（`$_SERVER`、`require`、`exit` 等）は除き、環境依存は依存性注入に置き換えます。

## 実務との対応（読み返し用）

| heat | エッセンス | `listing_variation.inc` でのイメージ |
|------|------------|--------------------------------------|
| heat-1 | **JSON 配列からページキーでエントリを探す** — `variationSkus` と `defaultCode` を取り出す | `load_from_json_file()` |
| heat-2 | **クエリ上書きと URL マップ生成** — 有効なコードなら `defaultCode` を上書き／コードごとに `baseUrl + code + ".html"` を組み立てる | `apply_listing_code_query()` + `build_goods_image_variations_json()` |
| heat-3 | **DI 付きオーケストレーター** — JSON 読み込み → クエリ適用 → マップ生成 を 1 入口に束ね、バリエーションが空なら `null` を返す | `variation_prepare()` |

## 練習の進め方

1. `heat-N/kata.ts` は **未実装スタブ**（`throw new Error("not implemented")`）から始まる。`kata.test.ts` と README の表を頼りに **kata.ts だけを実装**する。
2. 行き詰まったときだけ **`heat-N/kata.solution.ts`** を開き、仕様との対応を読む（写経より意図の理解を優先）。
3. `npx vitest forge-05-listing-variation-loader` がすべてグリーンになるまで繰り返す。

```bash
npx vitest forge-05-listing-variation-loader
```

## あえて入れていないもの

- ファイルシステム読み込み（`fs.readFile`）— ブラウザ／Node 共通で学べるよう、データは呼び出し元がパース済みの `unknown` として渡す。
- `window.location` や `URLSearchParams` の直接参照 — heat-3 では `getParam` / `getBaseUrl` の関数を注入することでテスト可能にする。
- バリエーションが空のときの 404 遷移（PHP の `exit`）— TS 版では `null` を返し、呼び出し元が判断する。
