# required / maxLength / pattern

難易度: ★☆☆

1つの値を検証して結果を返す「バリデータ」を生成するファクトリを3つ書く。エラーメッセージはファクトリの引数で受け取る。

> **背景**: 老舗EC の `if (name == '') { alert('...'); return false; }` という神 `validate()` から、**検証ルールだけ**を純関数として取り出す。alert も DOM 取得もしない。

## 与えられた型（`kata.ts` に定義済み）

```ts
type ValidationResult = { ok: true } | { ok: false; message: string };
type Validator = (value: string) => ValidationResult;
```

## 実装する関数

上の型を使い、次の3つのファクトリを自分で宣言・実装する。**シグネチャ（引数・戻り値の型）は自分で設計する**（`export` する名前は固定）。

- `required` — 必須チェックのバリデータを作る
- `maxLength` — 文字数上限チェックのバリデータを作る
- `pattern` — 正規表現による形式チェックのバリデータを作る

各ファクトリが何を引数に取り何を返すかは、下の「仕様」と「例」から読み取って決める。

## 仕様

- OK のとき `{ ok: true }`、NG のとき `{ ok: false, message }` を返す（`message` はファクトリに渡されたものをそのまま使う）。
- `required`: 空文字、および**空白文字のみ**の入力は未入力扱いで NG。
- `maxLength`: 文字数が `max` を**超えたら** NG。`max` ちょうどは OK。**空文字は OK**。
- `pattern`: `regex` に**マッチしない**値は NG。**空文字は OK**。
- `maxLength` と `pattern` が空文字を OK にするのは、「未入力かどうか」を `required` だけの責務にするため（任意項目に長さ・形式チェックだけを付けられる）。
- どのバリデータも例外を投げず、検証以外の副作用（alert・DOM・ログ）を持たない。

## 例

```ts
const name = required("お名前を入力してください");
name("山田太郎")   // { ok: true }
name("")           // { ok: false, message: "お名前を入力してください" }
name("   ")        // { ok: false, message: "お名前を入力してください" }  （空白のみ）

const len = maxLength(5, "5文字以内で入力してください");
len("あいうえお")   // { ok: true }   （ちょうど5文字）
len("あいうえおか") // { ok: false, message: "5文字以内で入力してください" }
len("")            // { ok: true }    （空文字は OK）

const tel = pattern(/^[0-9-]+$/, "電話番号の形式が正しくありません");
tel("03-1234-5678") // { ok: true }
tel("０３-１２３４") // { ok: false, message: "電話番号の形式が正しくありません" }
tel("")            // { ok: true }    （空文字は OK）
```

## 制約

- 入力 `value` は任意の文字列（空文字を含む）。
- 同じファクトリ戻り値を複数の値に使い回しても結果が混ざらないこと。

## 進め方

```bash
npx vitest forge-09-form-validation-rules/heat-1
```
