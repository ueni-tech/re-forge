# [heat-1] DOM 要素から payload を組み立てる

## 実務での使われ方

PDP（商品詳細ページ）で書体やサイズなどを選んだユーザーがカートボタンを押したとき、「次のページでも同じ選択肢を自動入力したい」という要件がある。

カートボタン押下直前に DOM を走査して `[data-basket-param]` を持つ要素の選択状態を Record として組み立て、sessionStorage に退避する処理がある。この「**DOM を走査して payload を組み立てる**」ロジックだけを純粋関数として切り出す。

## やりたいこと

`[data-basket-param]` 属性を持つ要素の配列を受け取り、`Record<string, string>` の payload を返す関数 `collectPayload` を作る。

DOM の生要素 (`HTMLElement`) ではなく、必要なプロパティだけを持つ**最小インターフェース型**を引数として受け取る。

## 入出力

```ts
type CollectableElement = {
  type: string;
  checked: boolean;
  value: string;
  dataset: { basketParam?: string; basketValue?: string };
};

function collectPayload(elements: CollectableElement[]): Record<string, string>;
```

- 入力: `data-basket-param` を持つ要素の配列（の最小インターフェース表現）
- 出力: 採用されたエントリだけを含む `Record<string, string>`

## あなたが決めること

実装する前に、自分で以下を決めて JSDoc の【契約】に書く:

### スキップ条件の優先順位

- `type` が `"radio"` / `"checkbox"` で `checked` が false のとき: スキップ?
- `dataset.basketParam` が `undefined` / `""` のとき: スキップ?
- これらの判定はどの順番でやるべきか? 順番を変えると挙動はブレるか?

### 値の決め方

- `dataset.basketValue` が `undefined` / `""` のときは何を採用する?
- `basketValue` を「あれば優先、なければ `el.value` にフォールバック」とする仕様の意図は何か?

### "" の扱い

- `dataset.basketValue === ""` のとき、それは「明示的な空文字を採用したい」のか「未指定」なのか?
- `undefined` と `""` を同じ扱いにする選択と、別扱いにする選択、それぞれ何を得て何を失うか?

### 戻り値の保証

- 有効なエントリが 0 件のとき何を返す?
- `null` を返す選択肢もありえる中で、`{}` を返すとしたら呼び出し側にとって何が嬉しいか?

## 設計の問い（実装前に考える）

この heat の本質は **「DOM を触る関数を、どうやって DOM なしでテストできる形にするか」** という設計判断にある。

- なぜ引数を `HTMLElement[]` ではなく `CollectableElement[]` という最小インターフェース型で受けているのか?
- もし `HTMLElement[]` を受けていたら、このテストは何が必要になるか? (`jsdom` / DOM のセットアップ / ...)
- 必要なプロパティ4つ (`type`, `checked`, `value`, `dataset`) だけに依存を絞ることで、何が変わるか?

実装が終わったら spec.md で答え合わせをする。

## 進め方

1. このファイルだけ読んで `kata.ts` を実装する
2. 実装が終わったら `spec.md` を開いて自分の判断と突き合わせる
3. `npx vitest forge-07-basket-param-prefill/heat-1` でテストを通す
