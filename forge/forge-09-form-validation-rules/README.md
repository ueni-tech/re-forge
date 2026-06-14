# forge-09-form-validation-rules — 神バリデーション関数の分解

老舗ECの注文・会員登録フォームに眠る「submit 時に走る数百行の `validate()` 神関数」を題材に、検証ロジックを「ルールの純関数化 → 合成 → スキーマ駆動」の3段階で分解する forge。

実務コードの直接の抽出ではなく、**老舗ECにありがちなレガシーコードを再現した題材**（forge-09〜11 のレガシーEC題材シリーズ1本目）。

## 練習の進め方

各 heat は2段階構成。詳細はリポジトリ直下の README を参照。

1. **段階A**: `problem.md` だけ読んで `kata.ts` を実装する
2. **段階B**: `spec.md` を開いて自分の判断と突き合わせ、テストを通す

```bash
npx vitest forge-09-form-validation-rules
```

## heat 構成

| heat | テーマ | 焦点 |
|------|--------|------|
| heat-1 | `required` / `maxLength` / `pattern` | 検証ルールの純関数化。boolean ではなく結果型で返す設計 |
| heat-2 | `composeValidators` / `collectErrors` | ルールの合成。「最初の NG で打ち切り」と「全収集」の戦略分離 |
| heat-3 | `validateForm` | スキーマ駆動。条件付きルール（`when`）を含むフォーム全体の宣言的検証 |

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

この神関数には4つの責務が溶けている。

1. **DOM 取得** — `$('#name').val()`
2. **検証ルール** — `name.length > 50`
3. **エラー通知** — `alert(...)`
4. **制御フロー** — `return false` による打ち切り

この forge で取り出すのは 2 と 4。1 と 3 は薄い境界関数として残す（spec.md heat-3「レガシー環境への持ち帰り方」参照）。

## 実務との対応

- 注文・会員登録・お問い合わせフォームの submit 前検証
- 「最初のエラーだけ alert」から「全エラーをインライン表示」への UX 改善要望
- 「配送先が別住所のときだけ必須」のようなフィールド間依存の条件付き必須

3 heat を通じて「ルールをコードの構造からデータへ降ろす」流れを体験する。heat-3 のスキーマは forge-07 heat-3 の Strategy テーブルの応用。

## JSDoc 雛形について

- **【意図】** 必須。呼ぶ側にとっての価値を1〜2行で。
- **【契約】** 任意。各 heat の `problem.md`「JSDoc【契約】を書く考え方」の4問への答え。型と問題文で表現できないことだけ書く。
- **【設計の読解】** 任意。結果型・閉じた合成・スキーマ駆動など、API 形状の理由。
- **【実装メモ】** 任意。自分が迷った判断があれば書く。

詳細はリポジトリ直下 [README.md](../../README.md) の「契約を書く考え方（4問）」を参照。
