# [heat-1] listing-variations.json からページキーのエントリを取得する

## 実務での使われ方

商品詳細ページのコントローラが `listing-variations.json` を読み込み、ページ自身のキー(ファイル名)でエントリを探してバリエーション一覧と初期コードを取得する。PHP 版では `__FILE__` からキーを導出するが、TS 版は「パース済みの `unknown` を受け取り純粋に変換する」形で再現する。

## やりたいこと

JSON データから、指定したページキーに対応する **バリエーション情報** と **初期コード** を取り出す。

## データ構造

JSON は配列。各要素は1つのページキーをプロパティに持つオブジェクト。

```json
[
  {
    "sample": {
      "defaultCode": "ST-TKV-A2",
      "variationSkus": [
        { "code": "ST-TKV-A1", "label": "白" },
        { "code": "ST-TKV-A2", "label": "黒" }
      ]
    }
  },
  {
    "another": { ... }
  }
]
```

## 入出力

```ts
type VariationSku = { code: string; label?: string };
type PageVariation = { variationSkus: VariationSku[]; defaultCode: string };

function loadPageVariation(data: unknown, pageKey: string): PageVariation
```

- **data**: `JSON.parse` 直後の値。型は `unknown`。
- **pageKey**: 探したいページキー(例: `"sample"`)。
- **戻り値**: そのページの `variationSkus` と `defaultCode`。

## あなたが決めること

実装する前に、自分で以下を決めて JSDoc の【契約】に書く:

- `data` が配列でない値(null・オブジェクト・プリミティブ)で渡されたら何を返す?
- `pageKey` が存在しなかったら何を返す?
- `variationSkus` がそもそも配列でなかったら?
- `defaultCode` が欠けていたり空文字だったら?
- 例外は投げる? 投げない?

決めたら実装する。決められないと感じたら、それは設計判断が必要な箇所。判断したことを記録する。

## 進め方

1. このファイルだけ読んで `kata.ts` を実装する
2. 実装が終わったら `spec.md` を開いて自分の判断と突き合わせる
3. `npx vitest` でテストを通す
