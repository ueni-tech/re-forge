# [heat-3] スキーマ駆動のフォーム検証

## 実務での使われ方

注文フォームには「**配送先に『別住所』を選んだときだけ、お届け先住所が必須**」のような条件付きルールが必ずある。神関数ではこうなっている。

```js
function validate() {
  // ...名前・電話のチェックが延々続いたあと...
  if ($('input[name="shippingType"]:checked').val() == 'other') {
    if ($('#shippingAddress').val() == '') {
      alert('お届け先住所を入力してください'); return false;
    }
  }
  return true;
}
```

フィールドが増えるたびに if が増え、「このフォームの検証ルール全体」を一覧できる場所がどこにもない。この heat では、フォーム全体のルールを**スキーマ（データ）として宣言**し、それを解釈する関数を1つ書く。

## やりたいこと

「フィールド名・ルール配列・適用条件」を並べたスキーマを受け取り、フォームの値全体を検証してフィールドごとのエラーを返す `validateForm` を作る。

## 入出力

```ts
// heat-1 と同じ型（kata.ts に定義済み）
type ValidationResult = { ok: true } | { ok: false; message: string };
type Validator = (value: string) => ValidationResult;

// フォームの値: フィールド名 → 入力値
type FormValues = Record<string, string>;

// スキーマの1行
type FieldSchema = {
  name: string;                          // FormValues のキー
  rules: Validator[];                    // 先頭から順に適用
  when?: (values: FormValues) => boolean; // false ならこのフィールドを検証しない
};

// フィールド名 → 最初のエラーメッセージ
type FormErrors = Record<string, string>;

function validateForm(values: FormValues, schema: FieldSchema[]): FormErrors;
```

### スキーマの例

```ts
const orderFormSchema: FieldSchema[] = [
  { name: "customerName", rules: [required("お名前を入力してください"), maxLength(50, "お名前は50文字以内で入力してください")] },
  { name: "tel", rules: [pattern(/^[0-9-]+$/, "電話番号の形式が正しくありません")] },
  {
    name: "shippingAddress",
    rules: [required("お届け先住所を入力してください")],
    when: (values) => values.shippingType === "other",
  },
];
```

## 合意済み仕様（この heat で握る挙動）

- **フィールド内は打ち切り**: 各フィールドの `rules` は先頭から順に適用し、最初の NG の `message` だけを `FormErrors` に入れる（heat-2 の `composeValidators` と同じ戦略）
- **フィールド間は全検証**: あるフィールドが NG でも、残りのフィールドの検証は続ける（ユーザーに全フィールドのエラーをまとめて見せられるように）
- `when` が定義されていて `false` を返すフィールドは検証せず、`FormErrors` にも含めない
- `when` が未定義のフィールドは常に検証する
- `values` に `name` のキーが存在しないときは、**空文字 `""` として検証する**（未入力と同じ扱い。チェックボックス未選択などで値ごと送られてこないケースに対応）
- すべて OK なら空オブジェクト `{}` を返す（呼び出し側は `Object.keys(errors).length === 0` で合否判定できる）
- 例外を投げない。`values` と `schema` を変更しない

## あなたが決めること

実装する前に、自分で以下を決めて JSDoc の【契約】に書く:

- 「フィールド内は打ち切り・フィールド間は全検証」というハイブリッドは、ユーザー体験として何を意図しているか?
- `when` の判定に `values` **全体**が渡されるのはなぜか?（自フィールドの値だけでは足りない理由）
- `values` にキーが無いケースを `""` 扱いにしないと、どこで何が壊れるか?
- 同じ `name` がスキーマに2回現れたら、`FormErrors` はどうなるか?（仕様には書いていない。自分の実装がどう振る舞うかを把握して契約に書く）
- heat-2 の `composeValidators` を部品として使うか、ループを直接書くか?

## JSDoc【契約】を書く考え方

heat-3 はオーケストレーター（下位のバリデータに検証を委譲する関数）。
【契約】はこの関数だけが決めること（スキップ条件、エラーの形、欠損キーの扱い）に絞る。
個々のルールの挙動は heat-1 で保証済み。

| # | 質問 |
|---|------|
| 1 | **正常時** — 全フィールド OK / 一部 NG のとき何が返る？ |
| 2 | **困った入力** — `values` にキーが無い、`when` が false、空のスキーマ |
| 3 | **しないこと** — 例外を投げる？ DOM を触る？ 入力を変更する？ |
| 4 | **暗黙の決め** — フィールド内打ち切り、name 重複時の挙動 |

### この heat への当てはめ（問いのみ）

- **正常時**: NG だったフィールドだけが `FormErrors` に載るか? メッセージは何番目のものか?
- **困った入力**: `values` に無いキー、`when` が false のフィールド、`schema` が空配列
- **しないこと**: `when` が false のフィールドのルールを実行する? alert を出す?
- **暗黙の決め**: name 重複時に先勝ちか後勝ちか、`when` の評価タイミング

## 設計の問い（実装前に考える)

この heat の本質は **「ルールをコードからデータへ降ろす」** こと。

- 神関数の if の羅列と `FieldSchema[]` を見比べる。「このフォームの検証ルールを教えて」と業務側に聞かれたとき、どちらが答えやすいか?
- `when` を `Validator` の中に書く（バリデータ内で条件分岐する）設計も可能。スキーマ側に置くのと何が違うか?
- このスキーマは forge-07 heat-3 の Strategy テーブルと同じ発想。何が共通しているか?

実装が終わったら spec.md で答え合わせをする。

## 進め方

1. このファイルだけ読んで `kata.ts` を実装する
2. 実装が終わったら `spec.md` を開いて自分の判断と突き合わせる
3. `npx vitest forge-09-form-validation-rules/heat-3` でテストを通す
