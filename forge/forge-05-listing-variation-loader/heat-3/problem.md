# [heat-3] DI 付きオーケストレーター — 3つの処理を 1 入口に束ねる

## 実務での使われ方

PHP の `variation_prepare()` 相当。商品詳細ページのコントローラが**1回呼ぶだけ**で `variationSkus` / `defaultCode` / `variationsMap` を受け取れるようにする。

heat-1 と heat-2 で作った3つの関数を順番に呼び出すだけ、と思いきや、ここには**設計上の難所**がある。

## やりたいこと

以下の3ステップを1つの関数にまとめる。

1. JSON 配列とページキーから `variationSkus` と `defaultCode` を取り出す
2. URL クエリの `listing-code` で `defaultCode` を上書き(無効値なら無視)
3. ベース URL とコード一覧から `variationsMap` を作る

## 難所: URL クエリと baseUrl をどう取るか

普通に書くと、こうなる:

```ts
const requestedCode = new URLSearchParams(location.search).get("listing-code");
const baseUrl = location.href.replace(/[^/]+$/, "");
```

しかしこれだと **`window.location` 依存**で単体テストが書けない。

そこで「**URL クエリと baseUrl を取得する処理を、外から関数として注入する**」設計を採る。

## 入出力

```ts
type PrepareResult = {
  variationSkus: VariationSku[];
  defaultCode: string;
  variationsMap: Record<string, { path: string }>;
};

function prepareVariation(
  rawData: unknown,
  pageKey: string,
  getParam: (name: string) => string | null,
  getBaseUrl: () => string,
): PrepareResult | null
```

- **getParam**: クエリパラメータ取得関数。例: `(name) => new URLSearchParams(location.search).get(name)`
- **getBaseUrl**: ベース URL 取得関数。例: `() => location.href.replace(/[^/]+$/, "")`

呼び出し側がこれらを「具体的な実装」として渡すので、関数本体は `window.location` を知らずに済む。

## あなたが決めること

- バリエーションが1件もなかった(`variationSkus.length === 0`)とき何を返すか?
  - 空の `PrepareResult` を返す? `null` を返す? 例外を投げる?
  - PHP 版は `exit` で 404 遷移しているが、TS 版は呼び出し元に判断させたい。
- `getParam("listing-code")` が `null` を返したらどうする?(これは heat-2 で判断済み)
- 3つの内部関数(`loadPageVariation` / `applyListingCodeParam` / `buildGoodsImageVariationsMap`)を呼ぶ順番は?
- 何を引数として渡し、何を内部で取得するか?

## JSDoc【契約】を書く考え方

実装前に、次の4問に答えてから `kata.ts` の【契約】に書く。詳細はリポジトリ直下 [README.md](../../../README.md) の「契約を書く考え方（4問）」。

| # | 質問 |
|---|------|
| 1 | **正常時** — うまくいったとき呼び出し側は何を受け取る？ |
| 2 | **困った入力** — 想定外・境界の入力ではどうなる？ |
| 3 | **しないこと** — 例外を投げる？ `window` を直接触る？ |
| 4 | **暗黙の決め** — 問題文に無いが自分で決めたことは？ |

### この heat への当てはめ（問いのみ。答えは spec.md で確認）

- **正常時**: `PrepareResult` の3フィールドはそれぞれ何を意味する？呼び出し側は heat-1/2 の3処理を意識しなくてよい？
- **困った入力**: `variationSkus` が空のとき / `getParam("listing-code")` が `null` のとき / 無効な listing-code のとき
- **しないこと**: 不正 JSON や不正クエリで例外を投げる？ 関数内で `window.location` を触る？
- **暗黙の決め**: 空の `PrepareResult` と `null` のどちらを選ぶ？ 空チェックはどの内部関数の直後に置く？

各行を書く前に仕分ける: 型で分かること・DI の理由（設計の読解）・内部の呼び順だけ（実装メモ）は【契約】に入れない。

## 観察ポイント(実装する前に考える)

このheatの本質的なテーマは「**DI(依存性注入)の意味**」を理解すること。

- なぜ `window.location` を直接呼ばずに `getParam` / `getBaseUrl` を引数で受けるのか
- これによってテストで何ができるようになるか
- 引数の数が増えるコストと、テスト容易性のメリットの天秤

実装が終わったら、**「もし `getParam` を引数にせず、関数内で `window.location` を直接呼んでいたら、テストはどう書けただろうか」**を考えてみる。それが DI の価値を体で理解する瞬間。

## 進め方

1. このファイルだけ読んで `kata.ts` を実装する
2. 実装が終わったら `spec.md` を開いて自分の判断と突き合わせる
3. `npx vitest` でテストを通す
