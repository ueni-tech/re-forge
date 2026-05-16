# [heat-2] 安全なパースと、構造的な name 解析

## 実務での使われ方

heat-1 で sessionStorage に保存した JSON 文字列を読み込み、フォームの各 input の `name` 属性（例: `"param[ST-TKV-A2][template][1][sha_name_2font2]"`）を解析して、対応する prefill 値を取り出す。

これを「**壊れた JSON で全体がクラッシュしないパース**」と「**name 属性の構造から目的の値を引く解析**」の2つに分割する。後者は heat-3 でフォームに適用するための前段にあたる。

## やりたいこと

2つの関数を作る:

1. `parsePrefillData(raw)`: sessionStorage から読んだ文字列を `PrefillData` にパースする。失敗時は例外を外に出さず `undefined` を返す。
2. `getPrefillValue(el, prefillData)`: 要素の `name` から階層キーを取り出し、`prefillData` から対応する値を引く。

## 入出力

```ts
type PrefillData = Record<string, Record<string, string>>;
type ElementWithName = { name?: string };

function parsePrefillData(raw: string | null | undefined): PrefillData | undefined;

function getPrefillValue(
  el: ElementWithName | null | undefined,
  prefillData: PrefillData,
): string | undefined;
```

`name` 属性は次の形を取る:

```
param[ST-TKV-A2][template][1][sha_name_2font2]
       ^^^^^^^^^                 ^^^^^^^^^^^^^^^
       listingCode              templateName
       (1階層目)                 (4階層目)
```

- 1階層目 = `listingCode`（`prefillData` の外側キー）
- 4階層目 = `templateName`（`prefillData[listingCode]` の内側キー）
- 2階層目・3階層目はこの関数の責務では使わない

## あなたが決めること

実装する前に、自分で以下を決めて JSDoc の【契約】に書く:

### `parsePrefillData` の失敗の扱い

- `raw` が `null` / `undefined` / `""` のとき: `undefined` を返す? 例外を投げる? 空オブジェクトを返す?
- JSON として壊れている (`"not json"`, `'{"key": "value"'`) とき: 何を返す?
- 失敗時に **例外を外に出さない**としたら、呼び出し側は失敗をどう知るか? その不便さは許容できるか?
- なぜ「壊れたデータでクラッシュしない」を最優先にしているのか?

### `parsePrefillData` のジェネリック性

- 戻り値の型は `PrefillData | undefined`。だが `JSON.parse` の戻り値は何でもありえる。
- パース成功時に「これは本当に `PrefillData` の形なのか」を検証する? しない?
- 検証しない選択の根拠は何か（手間 / 信頼境界 / 取り扱う値の出所）。

### `getPrefillValue` のキー解析方法

- `name` を文字列の `split` で分解する? 正規表現でマッチさせる?
- `split('[').join(...)` 的なアプローチと、正規表現の `match(...)` のアプローチで、何が違うか?
- `name` が想定外の形 (`"param[a][b][c]"` など3階層しかない) のとき: 何を返す?

### `getPrefillValue` のガード順序

次のガードのうち、どれを書き、どの順で書く?

- `el` が `null` / `undefined`
- `el.name` が `undefined` / `""`
- `name` が正規表現にマッチしない
- `prefillData[listingCode]` が存在しない
- `prefillData[listingCode][templateName]` が存在しない

「**全部書くべき**」「**TypeScript の型でいくつかは保証される**」など、判断が分かれる。

## 設計の問い（実装前に考える）

この heat の本質は **「責務の分離」** と **「失敗を握りつぶす設計はいつ正当化されるか」** の2つ。

- なぜ「パース」と「キー解析」を1つの関数にまとめなかったのか?
- もし `getPrefillValue` の中で `JSON.parse` も呼んでいたら、何が困るか?
- `parsePrefillData` が例外を外に出さない（`try/catch` で握りつぶす）のは、一般には**アンチパターン**とされる。それでもここで正当化される条件は何か?

実装が終わったら spec.md で答え合わせをする。

## 進め方

1. このファイルだけ読んで `kata.ts` を実装する
2. 実装が終わったら `spec.md` を開いて自分の判断と突き合わせる
3. `npx vitest forge-07-basket-param-prefill/heat-2` でテストを通す
