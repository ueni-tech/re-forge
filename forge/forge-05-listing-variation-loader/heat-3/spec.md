# [heat-3] spec.md — 答え合わせ用

**注意: kata.ts を実装してから開くこと。**

## お題側が想定した仕様

① `loadPageVariation(rawData, pageKey)` を呼び `variationSkus` と `defaultCode` を取得する。

② `variationSkus.length === 0` なら `null` を返す(PHP 版の 404 exit に相当)。

③ `getParam("listing-code")` の値と `variationSkus`・`defaultCode` を `applyListingCodeParam` に渡し、確定した `defaultCode` を得る。

④ `getBaseUrl()` を呼び `buildGoodsImageVariationsMap(variationSkus, baseUrl)` で `variationsMap` を生成する。

⑤ `{ variationSkus, defaultCode, variationsMap }` を返す。

## 自分の契約と比較する観点

### 「空のとき null を返す」設計

- なぜ空の `PrepareResult` を返すのではなく `null` か?
  - **「使える結果が無い」を呼び出し側に明示する**ため。
  - 空の `PrepareResult` を返すと、呼び出し側が `variationSkus.length` をチェックする手間が増える。
  - `null` なら `if (!result) return;` で済む。
- 自分はどう判断したか? なぜそう判断したか?

### 関数呼び出しの順序

- ② のチェックを「`loadPageVariation` の直後」に置いた判断は重要。
  - もし `applyListingCodeParam` の後に置いていたら、空配列に対して無駄な処理を走らせることになる。
  - **早期 return は「無駄な処理を防ぐ」だけでなく、「無効な状態に対する関数呼び出しを防ぐ」**役割もある。

### DI の引数設計

- `getParam` が `string | null` を返すシグネチャ。
- これは `URLSearchParams.prototype.get` の返り値と一致させている。
- **既存 API のシグネチャに合わせる**ことで、本番では `URLSearchParams` をそのまま渡せる。

```ts
// 本番
prepareVariation(data, "sample",
  (name) => new URLSearchParams(location.search).get(name),
  () => location.href.replace(/[^/]+$/, "")
);

// テスト
prepareVariation(data, "sample",
  () => "ST-TKV-A3",  // 固定値を返すだけ
  () => "https://example.com/sample/"
);
```

## 観察ポイント: DI の本当の価値

DIは「テストしやすくする」ためのものと説明されるが、本質はもう一段深い。

**「この関数は何に依存しているか」を引数で表現する**ことで、関数の責務が明示される。

- `prepareVariation` のシグネチャを見るだけで、「URL クエリと baseUrl に依存する」ことが分かる。
- もし内部で `window.location` を直接触っていたら、シグネチャからは分からない。
- **依存を引数化することは、責務を可視化することと同義。**

これが「**設計の自己説明性**」。良い設計はコメントを読まなくても、シグネチャを見れば責務が分かる。

## 自分の JSDoc を見直す観点

`prepareVariation` の【意図】を書いてみたか? 「3つの関数を順番に呼ぶ」と書きたくなったら、それは挙動の説明であって意図ではない。

意図はこういう書き方になる:

> 商品詳細ページに必要な「初期表示すべきコード」「バリエーション一覧」「コード別URLマップ」を、JSON とページキーとURL文脈から一度に取り出す。呼び出し側は3つの処理ステップを意識せずに済む。

**「呼び出し側が何を意識せずに済むか」**を書くと、関数の存在意義が明確になる。
