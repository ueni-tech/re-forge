# [heat-1] 単一フィールドのバリデータ

## 実務での使われ方

老舗ECの注文・会員登録フォームでは、submit ハンドラにこんなコードが眠っていることが多い。

```js
function validate() {
  var name = $('#name').val();
  if (name == '') { alert('お名前を入力してください'); return false; }
  if (name.length > 50) { alert('お名前は50文字以内で入力してください'); return false; }
  var tel = $('#tel').val();
  if (tel != '' && !tel.match(/^[0-9\-]+$/)) { alert('電話番号の形式が正しくありません'); return false; }
  // ...これが郵便番号・メール・住所と延々続く
  return true;
}
```

この神関数には「DOM取得・検証ルール・エラー通知・制御フロー」の4責務が溶けている。この heat では、その中から **検証ルールだけ** を純関数として取り出す。

## やりたいこと

「1つの値を検証して結果を返す」バリデータ関数を生成するファクトリを3つ作る。

- `required` — 必須チェック
- `maxLength` — 文字数上限チェック
- `pattern` — 正規表現による形式チェック

エラーメッセージは固定文言ではなく、**ファクトリの引数として呼び出し側が渡す**。

## 入出力

```ts
type ValidationResult =
  | { ok: true }
  | { ok: false; message: string };

type Validator = (value: string) => ValidationResult;

function required(message: string): Validator;
function maxLength(max: number, message: string): Validator;
function pattern(regex: RegExp, message: string): Validator;
```

- **required(message)**: 値が未入力なら NG になるバリデータを返す
- **maxLength(max, message)**: 文字数が `max` を超えたら NG になるバリデータを返す
- **pattern(regex, message)**: 値が `regex` にマッチしなければ NG になるバリデータを返す

## 合意済み仕様（この heat で握る挙動）

- 検証 OK のとき `{ ok: true }` を返す。NG のとき `{ ok: false, message }` を返す（message はファクトリに渡されたものをそのまま使う）
- `required`: 空文字、および**空白文字のみの入力**は未入力扱いで NG（業務側と「スペースだけの名前は受け付けない」で合意済み）
- `maxLength`: 文字数が `max` を**超えたら** NG。`max` ちょうどは OK。**空文字は OK**
- `pattern`: `regex` にマッチしない値は NG。**空文字は OK**
- `maxLength` と `pattern` が空文字を OK にするのは、「未入力かどうか」は `required` だけの責務とするため（任意項目に長さ・形式チェックだけを付けられるようにする）
- どのバリデータも例外を投げない。検証以外の副作用（alert・DOM操作・ログ）を持たない

## あなたが決めること

実装する前に、自分で以下を決めて JSDoc の【契約】に書く:

- 「未入力」の判定はどこでやる? `value === ""` だけで足りるか?
- `maxLength` に `max` ちょうどの長さの値が来たら OK か NG か?（合意済み仕様を自分の言葉で言い直す）
- 同じバリデータ（例: `required("必須です")` の戻り値）を複数のフィールドで使い回したら、何か問題が起きるか?
- boolean を返す設計（`(value) => boolean`）と比べて、結果型 `ValidationResult` を返す設計は何が違うか?

## JSDoc【契約】を書く考え方

4問に答えてから【契約】に書く。詳細はリポジトリ直下 README の「契約を書く考え方（4問）」。

| # | 質問 |
|---|------|
| 1 | **正常時** — OK / NG のときそれぞれ何が返る？ |
| 2 | **困った入力** — 空文字、空白のみ、max ちょうど |
| 3 | **しないこと** — 例外を投げる？ alert を出す？ |
| 4 | **暗黙の決め** — 空文字を OK にしたバリデータはどれか、その理由 |

### この heat への当てはめ（問いのみ）

- **正常時**: OK と NG で返り値の形はどう変わる? message はどこから来る?
- **困った入力**: `"   "`（空白のみ）は `required` でどうなる? `maxLength` / `pattern` に空文字が来たら?
- **しないこと**: バリデータが検証以外にやってはいけないことは?
- **暗黙の決め**: trim をどこでかけるか。`max` ちょうどの扱い

## 設計の問い（実装前に考える）

この heat の本質は **「検証ルールを値として持ち運べる形にする」** こと。

- なぜ `required(value, message)` のような単発関数ではなく、`required(message)` がバリデータ関数を**返す**2段構えにするのか?
- メッセージをバリデータの中に固定で書かず、ファクトリの引数で受けるのはなぜか?
- この「設定を受け取って関数を返す」形は、forge-01 のクロージャとどうつながっているか?

実装が終わったら spec.md で答え合わせをする。

## 進め方

1. このファイルだけ読んで `kata.ts` を実装する
2. 実装が終わったら `spec.md` を開いて自分の判断と突き合わせる
3. `npx vitest forge-09-form-validation-rules/heat-1` でテストを通す
