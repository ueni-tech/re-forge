# [heat-2] ルールの合成 — 打ち切りと全収集

## 実務での使われ方

heat-1 で「名前は必須・50文字以内」のようにバリデータを配列に並べられるようになった。次は **複数ルールを1つの検証として実行する** 仕組みが要る。

レガシーコードの神関数では `return false` の連打で「最初のエラーで打ち切り」が暗黙に実現されていた。一方、業務改善でよくある要望は「エラーを1個ずつ直させるのではなく、**全部まとめて表示してほしい**」。つまり実務には**打ち切り**と**全収集**の両方の需要がある。

## やりたいこと

heat-1 のバリデータ（`Validator` 型）を複数まとめて実行する関数を2つ作る。

- `composeValidators` — 複数のバリデータを**1つのバリデータに合成**する（最初の NG で打ち切り）
- `collectErrors` — 値に対して全バリデータを実行し、**NG メッセージを全部集める**

## 入出力

```ts
// heat-1 と同じ型（kata.ts に定義済み）
type ValidationResult = { ok: true } | { ok: false; message: string };
type Validator = (value: string) => ValidationResult;

function composeValidators(validators: Validator[]): Validator;
function collectErrors(value: string, validators: Validator[]): string[];
```

- **composeValidators(validators)**: バリデータの配列を受け取り、**合成された1つのバリデータ**を返す
- **collectErrors(value, validators)**: 値と配列を受け取り、NG メッセージの配列を返す

## 合意済み仕様（この heat で握る挙動）

### composeValidators

- 返ってくる関数は配列の**先頭から順に**バリデータを適用する
- 最初に NG になった時点で打ち切り、その `{ ok: false, message }` をそのまま返す（後続のバリデータは**実行しない**）
- すべて OK なら `{ ok: true }` を返す
- 空配列を渡されたら、常に `{ ok: true }` を返すバリデータになる
- 合成結果は `Validator` 型そのもの。**合成済みバリデータをさらに合成の材料にできる**

### collectErrors

- 配列の**先頭から順に**全バリデータを実行し、NG だったものの `message` を順番どおりに配列で返す
- すべて OK なら空配列 `[]` を返す
- 空配列を渡されたら `[]` を返す

### 共通

- 例外を投げない。渡された `validators` 配列を変更しない

## あなたが決めること

実装する前に、自分で以下を決めて JSDoc の【契約】に書く:

- `composeValidators` で「打ち切り」を選ぶと、後続バリデータが実行されないことに意味はあるか?（heat-1 の `pattern` が空文字を OK にした設計と合わせて考える）
- `collectErrors` の戻り値が「OK なら空配列」であることを、呼び出し側はどう使えるか?（`if` の書き方を想像する）
- `composeValidators([])` が「常に OK」なのはなぜ妥当か?（ルールが1つもないフィールドとは何か）
- なぜ `composeValidators` だけが `Validator` を返し、`collectErrors` は返さないのか?（`ValidationResult` 型は message を**1つしか**持てないことに注目）

## JSDoc【契約】を書く考え方

4問に答えてから【契約】に書く。詳細はリポジトリ直下 README の「契約を書く考え方（4問）」。

| # | 質問 |
|---|------|
| 1 | **正常時** — 全 OK / 途中で NG のとき、それぞれ何が返る？ |
| 2 | **困った入力** — 空配列、NG が複数あるとき |
| 3 | **しないこと** — 打ち切り後に後続を実行する？ 入力配列を変更する？ |
| 4 | **暗黙の決め** — 適用順序、空配列 = 常に OK という解釈 |

### この heat への当てはめ（問いのみ）

- **正常時**: 合成バリデータは何番目の message を返す? `collectErrors` の並び順は?
- **困った入力**: `validators` が空配列のとき、それぞれ何を返す?
- **しないこと**: NG の後のバリデータを実行する? 結果の順序を並べ替える?
- **暗黙の決め**: 「先頭から順に」をどう保証するか

## 設計の問い（実装前に考える）

この heat の本質は **「合成しても型が変わらない」** ことの価値。

- `composeValidators` の入力は `Validator[]`、出力は `Validator`。入力と出力が同じ型だと、何が嬉しいか?
- 神関数の `return false` 連打は、実は「打ち切り戦略がコードの構造に固定されている」状態。戦略を関数として分離すると何が変わるか?
- 表示要件が「最初の1件だけ表示」から「全件表示」に変わったとき、heat-1 のバリデータは1行でも変更が必要か?

実装が終わったら spec.md で答え合わせをする。

## 進め方

1. このファイルだけ読んで `kata.ts` を実装する
2. 実装が終わったら `spec.md` を開いて自分の判断と突き合わせる
3. `npx vitest forge-09-form-validation-rules/heat-2` でテストを通す
