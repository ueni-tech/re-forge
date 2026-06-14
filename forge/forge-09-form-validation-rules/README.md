# forge-09-form-validation-rules — 神バリデーション関数の分解

老舗ECの注文・会員登録フォームに眠る「submit 時に走る数百行の `validate()` 神関数」を題材に、検証ロジックを「ルールの純関数化 → 合成 → スキーマ駆動」の3段階で分解する forge。

実務コードの直接の抽出ではなく、**老舗ECにありがちなレガシーコードを再現した題材**（レガシーEC題材シリーズ）。

## この forge は競技プログラミング形式

LeetCode / Codewars のような形式で構成している（forge-10 と同じ）。

- `spec.md` や契約4問はない。`problem.md` に **問題文・入出力例・制約・実装する関数名** だけを書く（関数シグネチャは渡さない）。
- 各 heat は入力 → 出力が明確に決まっており、テストを通せば正解。
- ファイルは `problem.md` / `kata.ts` / `kata.test.ts` / `kata.solution.ts` の4つ。
- `kata.ts` には**設計メモと「与えられた型」だけ**を置く。**関数シグネチャは渡さない**ので、`problem.md` を読んで引数・戻り値の型から自分で設計・宣言する（`export` 名はテストに合わせる）。最初はテストが落ちる状態から始まる。

## heat 構成

| heat | 関数 | 難易度 | 焦点 |
|------|------|--------|------|
| heat-1 | `required` / `maxLength` / `pattern` | ★☆☆ | 検証ルールの純関数化。boolean ではなく結果型で返す |
| heat-2 | `composeValidators` / `collectErrors` | ★★☆ | ルールの合成。「最初の NG で打ち切り」と「全収集」の戦略分離 |
| heat-3 | `validateForm` | ★★★ | スキーマ駆動。条件付きルール（`when`）を含むフォーム全体の宣言的検証 |

## 設計メモ（competitive 版の言語化装置）

各 `kata.ts` の先頭に **どの kata でも使える汎用の設計問い（4問）** を「設計メモ」コメントとして埋め込んでいる。3 heat すべて同じ問い。

| # | 問い |
|---|------|
| Q1 | 入力の境界（空・0件・想定外の値）で何を返すと決めたか? |
| Q2 | 呼び出し側に何を保証し、何をしないと決めたか?（例外・破壊の有無） |
| Q3 | なぜこの書き方・データ構造を選んだか?（他の選択肢と比べて） |
| Q4 | 前後の処理との役割分担は適切か?（この関数が担うこと・担わないこと） |
| メモ | Q1〜Q4 に当てはまらない気づき・判断根拠（空欄可） |

- **解く前**: 念頭に置くチェックリストとして眺める。
- **解いた後**: 「こう考えたから、こう書いた」を `→` の後ろに1〜2行で残す。答えがある項目だけでよい。メモ欄は Q4 に当てはまらない考察（ガードの要否、型と実行時の違いなど）を自由に残せる。

参考回答は `kata.solution.ts` 末尾の「設計メモ 参考回答（汎用4問 × この kata）」にある。自分の答えと突き合わせる。

## 元ネタのレガシーコード

```js
function validate() {
  var name = $('#name').val();
  if (name == '') { alert('お名前を入力してください'); return false; }
  if (name.length > 50) { alert('お名前は50文字以内で入力してください'); return false; }
  var tel = $('#tel').val();
  if (tel != '' && !tel.match(/^[0-9\-]+$/)) { alert('電話番号の形式が正しくありません'); return false; }
  if ($('input[name="shippingType"]:checked').val() == 'other') {
    if ($('#shippingAddress').val() == '') { alert('お届け先住所を入力してください'); return false; }
  }
  return true;
}
```

この神関数には「DOM取得・検証ルール・エラー通知・制御フロー」の4責務が溶けている。この forge で取り出すのは検証ルールと制御フロー。DOM 取得とエラー通知は薄い境界として呼び出し側に残す。

## 進め方

```bash
npx vitest forge-09-form-validation-rules          # forge 全体
npx vitest forge-09-form-validation-rules/heat-1   # heat 単体
```

`kata.ts` を実装してテストを通す。行き詰まったら `kata.solution.ts` を見る。
