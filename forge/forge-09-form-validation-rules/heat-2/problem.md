# composeValidators / collectErrors

難易度: ★★☆

heat-1 のバリデータ（`Validator` 型）を複数まとめて実行する関数を2つ書く。「最初の NG で打ち切る」版と「NG を全部集める」版。

> **背景**: 神 `validate()` の `return false` 連打は「最初のエラーで打ち切り」を暗黙にやっていた。一方で実務には「エラーを全部まとめて表示したい」という要望もある。両方の戦略を関数として分離する。

## 与えられた型（`kata.ts` に定義済み）

```ts
type ValidationResult = { ok: true } | { ok: false; message: string };
type Validator = (value: string) => ValidationResult;
```

## 実装する関数

次の2つの関数を自分で宣言・実装する。**シグネチャ（引数・戻り値の型）は自分で設計する**（`export` する名前は固定）。

- `composeValidators` — 複数のバリデータを1つのバリデータに合成する（最初の NG で打ち切り）
- `collectErrors` — 値に全バリデータを適用し、NG メッセージを全部集める

引数・戻り値の型は下の「仕様」と「例」から読み取って決める。

## 仕様

### composeValidators

- 配列の**先頭から順に**適用し、最初に NG になった時点で打ち切ってその `{ ok: false, message }` をそのまま返す（後続は**実行しない**）。
- すべて OK なら `{ ok: true }`。
- 空配列なら、常に `{ ok: true }` を返すバリデータになる。
- 戻り値は `Validator` 型そのもの（合成結果をさらに合成の材料にできる）。

### collectErrors

- 配列の**先頭から順に全部**実行し、NG だったものの `message` を順番どおりに配列で返す。
- すべて OK なら空配列 `[]`。空配列を渡されたら `[]`。

### 共通

- 例外を投げない。渡された `validators` 配列を変更しない。

## 例

```ts
const ng = (m: string): Validator => () => ({ ok: false, message: m });
const ok = (): Validator => () => ({ ok: true });

const v = composeValidators([ok(), ng("1つ目"), ng("2つ目")]);
v("値")  // { ok: false, message: "1つ目" }   （打ち切り。2つ目は実行されない）

composeValidators([ok(), ok()])("値")  // { ok: true }
composeValidators([])("値")            // { ok: true }

collectErrors("値", [ng("A"), ok(), ng("B")])  // ["A", "B"]
collectErrors("値", [ok(), ok()])              // []
collectErrors("値", [])                        // []
```

## 制約

- `collectErrors` の戻り値は NG の出現順を保つこと。
- どちらの関数も入力配列を破壊しないこと。

## 進め方

```bash
npx vitest forge-09-form-validation-rules/heat-2
```
