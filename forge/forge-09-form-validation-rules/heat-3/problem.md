# validateForm

難易度: ★★★

「フィールド名・ルール配列・適用条件」を並べたスキーマを受け取り、フォームの値全体を検証してフィールドごとのエラーを返す関数を書く。

> **背景**: 「配送先が別住所のときだけ住所必須」のような条件付きルールを、神 `validate()` の if ネストではなく**スキーマ（データ）**で宣言し、それを解釈するエンジンを1つ書く。

## 与えられた型（`kata.ts` に定義済み）

```ts
type ValidationResult = { ok: true } | { ok: false; message: string };
type Validator = (value: string) => ValidationResult;

type FormValues = Record<string, string>;            // フィールド名 → 入力値

type FieldSchema = {
  name: string;                                       // FormValues のキー
  rules: Validator[];                                 // 先頭から順に適用
  when?: (values: FormValues) => boolean;             // false なら検証しない
};

type FormErrors = Record<string, string>;             // フィールド名 → 最初のエラー
```

## 実装する関数

上の型を使い、`validateForm` を自分で宣言・実装する。**シグネチャ（引数・戻り値の型）は自分で設計する**（`export` する名前は固定）。何を引数に取り何を返すかは下の「仕様」と「例」から読み取って決める。

## 仕様

- **フィールド内は打ち切り**: 各フィールドの `rules` を先頭から適用し、最初の NG の `message` だけを `FormErrors` に入れる。
- **フィールド間は全検証**: あるフィールドが NG でも、残りのフィールドの検証は続ける。
- `when` が定義されていて `false` を返すフィールドは検証せず、`FormErrors` にも含めない。`when` 未定義のフィールドは常に検証する。
- `values` に `name` のキーが無いときは、**空文字 `""`** として検証する（未入力と同じ扱い）。
- すべて OK なら空オブジェクト `{}` を返す。
- 例外を投げない。`values` と `schema` を変更しない。

## 例

```ts
const schema: FieldSchema[] = [
  { name: "customerName", rules: [required("お名前を入力してください"), maxLength(50, "お名前は50文字以内で入力してください")] },
  { name: "tel", rules: [pattern(/^[0-9-]+$/, "電話番号の形式が正しくありません")] },
  { name: "shippingAddress", rules: [required("お届け先住所を入力してください")], when: (v) => v.shippingType === "other" },
];

validateForm({ customerName: "山田太郎", tel: "03-1234-5678", shippingType: "same" }, schema)
// {}

validateForm({ customerName: "", tel: "abc", shippingType: "same" }, schema)
// { customerName: "お名前を入力してください", tel: "電話番号の形式が正しくありません" }

validateForm({ customerName: "山田太郎", shippingType: "other" }, schema)
// { shippingAddress: "お届け先住所を入力してください" }   （キーが無くても "" 扱いで NG）

validateForm({ customerName: "山田太郎", shippingType: "same", shippingAddress: "" }, schema)
// {}   （when が false なので shippingAddress は検証しない）
```

## 制約

- `FormErrors` に載るのは NG だったフィールドのみ。
- ルールの適用順・フィールドの走査順は `schema` の順序に従う。

## 進め方

```bash
npx vitest forge-09-form-validation-rules/heat-3
```
