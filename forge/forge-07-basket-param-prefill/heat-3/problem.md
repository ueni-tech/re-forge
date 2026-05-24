# [heat-3] Strategy パターン + DI によるフォーム適用

## 実務での使われ方

heat-2 でパース・解析した prefill 値を、フォームの各 input に**適用**する。input のタイプによって適用方法が違う:

- `radio` / `checkbox`: 該当する選択肢を `el.click()` で選ぶ（`el.value = ...` では UI が更新されないため）
- `text` などそれ以外: `el.value = ...` で直接代入する

これを `if/else` の分岐で書く代わりに、**Strategy テーブル**として表現する。さらに `initForm` は `prefillData` を引数で受け取る **DI 形式**にすることで、sessionStorage をモックせずに単体テストが書けるようにする。

## やりたいこと

2つの関数を作る:

1. `getStrategyKey(el)`: 要素から Strategy テーブルのキー文字列を返す。
2. `initForm(form, prefillData)`: フォーム内の対象要素を走査し、各要素に prefill 値を適用するオーケストレーション関数。

`getPrefillValue`（heat-2 と同じ実装）と `applyStrategies`（Strategy テーブル）はスタブとして提供済み。**変更しない**。

## 入出力

```ts
type PrefillData = Record<string, Record<string, string>>;

type PrefillableElement = {
  type: string;
  name: string;
  value: string;
  click: () => void;
};

type PrefillableForm = {
  querySelectorAll: (selector: string) => PrefillableElement[];
};

function getStrategyKey(el: { type: string }): "checked" | "default";

function initForm(
  form: PrefillableForm | null | undefined,
  prefillData: PrefillData | undefined,
): void;
```

提供済みの Strategy テーブル:

```ts
const applyStrategies: Record<string, (el: PrefillableElement, val: string) => void> = {
  checked(el, val) {
    if (el.value === val) el.click();
  },
  default(el, val) {
    el.value = val;
  },
};
```

## あなたが決めること

実装する前に、自分で以下を決めて JSDoc の【契約】に書く:

### `getStrategyKey` の責務

- なぜ「Strategy 関数そのもの」ではなく「**キー文字列**」を返すのか?
- `(el) => applyStrategies.checked` のように関数を直接返さない理由は?

### `initForm` のガード

- `form` が `null` / `undefined` のとき: 何をする?
- `prefillData` が `undefined` のとき: 何をする?
- `prefillData` が `{}`（空オブジェクト）のとき: 何をする? `undefined` と区別する?

### querySelectorAll のセレクタ

- 対象要素は `form.querySelectorAll('[name^="param["]')` で取る
- なぜ `'[name]'` ではなく `'[name^="param["]'` で絞っているのか?
- もし絞らなかったらどうなる?

### Strategy フォールバック

- `applyStrategies[getStrategyKey(el)]` が `undefined` だったら? （現状の `getStrategyKey` は `"checked"` か `"default"` しか返さないが、将来増えたとき）
- `?? applyStrategies.default` でフォールバックすべきか? しなくてもいいか?

### radio の `click()` という選択

提供されている Strategy:

```ts
checked(el, val) {
  if (el.value === val) el.click();
}
```

- なぜ `el.checked = true` ではなく `el.click()` を呼んでいるのか?
- DOM の `click()` を呼ぶことで、何が起きるか?（イベントハンドラ、aria 属性、関連する UI 更新）

### DI の意味

- `prefillData` を引数で受けず、関数内で `sessionStorage.getItem(...)` を直接呼んでいたら、このテストはどう書くことになるか?
- もし「テストのときだけ DI、本番では sessionStorage を直接呼ぶ」というラッパー関数を別に作るとしたら、責務の境界はどこに置くか?

## JSDoc【契約】を書く考え方

関数が2つあるので、**それぞれ**4問に答えて【契約】に書く。詳細は [README.md](../../../README.md) の「契約を書く考え方（4問）」。

| # | 質問 |
|---|------|
| 1 | **正常時** — 成功時に何が返る / フォームに何が起きる？ |
| 2 | **困った入力** — 上記「あなたが決めること」の各問い |
| 3 | **しないこと** — 例外を投げる？ sessionStorage を関数内で読む？ |
| 4 | **暗黙の決め** — Strategy フォールバック、セレクタの絞り込み |

### `getStrategyKey` への当てはめ（問いのみ）

- **正常時**: radio/checkbox とそれ以外でどのキーを返す？
- **困った入力**: 想定外の type（将来の拡張）
- **しないこと**: Strategy 関数本体を返す？
- **暗黙の決め**: キー文字列にした理由（関数を返さない）

### `initForm` への当てはめ（問いのみ）

- **正常時**: 各要素に prefill が適用される流れ
- **困った入力**: form / prefillData が null・undefined・`{}`、getPrefillValue が undefined
- **しないこと**: sessionStorage を触る？ 例外を投げる？
- **暗黙の決め**: `querySelectorAll` のセレクタ、Strategy が undefined のとき

DI・Strategy の「なぜ」は【設計の読解】へ。内部の呼び順だけは【実装メモ】へ。

## 設計の問い（実装前に考える）

この heat の本質は次の2つを体感すること:

### 1. Strategy パターンの「キーで引く」設計

```ts
const strategy = applyStrategies[getStrategyKey(el)];
strategy(el, val);
```

`if (el.type === "radio") { ... } else { ... }` と比べて何が違うか:

- 新しい input タイプを追加するとき、`applyStrategies` にキーを足すだけで済む
- ロジック本体（`initForm`）に手を入れる必要がない
- 「**分岐**」を「**ルックアップ**」に変える設計

これは「**Open/Closed 原則**」（既存コードを変更せずに拡張可能にする）の具体例。

### 2. DI = 「責務をシグネチャに出す」

`initForm(form, prefillData)` のシグネチャを見ただけで:

- フォーム要素に依存する（`form`）
- prefill データに依存する（`prefillData`）

ことが分かる。もし関数内で `document.querySelector` や `sessionStorage` を直接呼んでいたら、**シグネチャからは依存が見えない**。

> 「依存を引数化することは、責務を可視化することと同義」

これは _sample/heat-3 で出てきた DI の本質と同じパターン。

実装が終わったら spec.md で答え合わせをする。

## 進め方

1. このファイルだけ読んで `kata.ts` を実装する
2. 実装が終わったら `spec.md` を開いて自分の判断と突き合わせる
3. `npx vitest forge-07-basket-param-prefill/heat-3` でテストを通す
