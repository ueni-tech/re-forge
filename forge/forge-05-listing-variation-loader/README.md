# forge-05-listing-variation-loader — バリエーション JSON の読み込み・クエリ適用・URL マップ生成

業務リポジトリ（hankoya）の **`_packages/lib/shop_item/listing_variation.inc`** から、
**JSON エントリの検索**・**クエリパラメータによる初期コード上書き**・**data-goods-image-variations 用 URL マップ生成**・**オーケストレーション** の 4 処理を切り出した forge。

## 練習の進め方(2段階構成)

この forge は「責務を自分で言語化する訓練」と「テストで答え合わせする学習」を両立させるため、2段階で進める。

### 段階A: 仕様起こし

1. `heat-N/problem.md` を読む。**問題と入出力だけが書いてある。**
2. `heat-N/kata.ts` を開く。関数シグネチャと JSDoc 雛形だけがある。
3. **自分で契約を書く**。
   - 入力が想定外のとき何を返すか
   - エッジケースをどう扱うか
   - 失敗時の挙動
4. 契約に沿って実装する。

この段階では `spec.md` と `kata.test.ts` を**開かない**こと。自分の頭で仕様を決める訓練が目的。

### 段階B: 答え合わせ

5. `heat-N/spec.md` を開く。お題側が想定した仕様が書いてある。
6. 自分の契約と spec.md を**突き合わせる**。
   - 自分が考えなかったエッジケースは何か
   - 自分が過剰に考えた部分はどこか
   - 一致した部分は言語化が当たっている
7. `npx vitest forge-05-listing-variation-loader` を実行する。
8. テストで落ちた箇所を直しつつ、契約も更新する。

### 解答との比較

行き詰まったら **`heat-N/kata.solution.ts`** を開く。写経より意図の理解を優先。

```bash
npx vitest forge-05-listing-variation-loader
```

## heat構成

| heat | エッセンス | `listing_variation.inc` でのイメージ |
|------|------------|--------------------------------------|
| heat-1 | **JSON 配列からページキーでエントリを探す** | `load_from_json_file()` |
| heat-2 | **クエリ上書きと URL マップ生成** | `apply_listing_code_query()` + `build_goods_image_variations_json()` |
| heat-3 | **DI 付きオーケストレーター** | `variation_prepare()` |

## あえて入れていないもの

- ファイルシステム読み込み(`fs.readFile`) — データは呼び出し元がパース済みの `unknown` として渡す。
- `window.location` や `URLSearchParams` の直接参照 — heat-3 では `getParam` / `getBaseUrl` を注入する。
- バリエーションが空のときの 404 遷移(PHP の `exit`) — TS 版では `null` を返し、呼び出し元が判断する。

## JSDoc 雛形について

雛形は「埋めるべきテンプレート」ではなく「**書く価値があるときの引き出し**」。書くことが無い項目は省略してよい。

- **【意図】** 必須。呼ぶ側にとっての価値を1〜2行で。
- **【契約】** 任意。型と問題文で表現できないことだけ書く。書き写しはしない。
- **【設計の読解】** 任意。お題が指定した構造の意図を、自分の言葉で推論する。
- **【実装メモ】** 任意。自分が迷った判断があれば書く。
