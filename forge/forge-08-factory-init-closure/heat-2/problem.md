# [heat-2] ファクトリ呼び出し時に初期化副作用を実行する

## 実務での使われ方

`createGalleryVariationSync`（`listing-variation-goods-image.ts`）は、ファクトリを呼んだ瞬間に「現在選ばれているバリエーションボタンを `is-selected` / `disabled` にする」初期 UI 同期を実行する。

これはなぜか。ページ読み込み時にサーバーが出力した HTML 上のボタン状態と、JS が管理するアクティブ状態を一致させるためだ。「ファクトリを呼ぶ = セットアップする」という慣習で、初期化とハンドラ生成が1回の呼び出しに収まっている。

## やりたいこと

heat-1 の `createBlockSwitcher` を発展させ、ファクトリ呼び出し時に**初期ボタン選択状態の同期**を行ってからハンドラ関数を返す `createButtonSwitcher` を作る。

## 入出力

```ts
function createButtonSwitcher(): ((code: string) => void) | null
```

- 引数: なし（DOM から取得する）
- 戻り値:
  - `.js-variant-picker` が存在する → `selectButton(code: string) => void`
  - 存在しない → `null`

### 対象 DOM

```html
<div class="js-variant-picker" data-initial-code="ST-A1">
  <button class="js-variant-btn" data-code="ST-A1">サイズA1</button>
  <button class="js-variant-btn" data-code="ST-A2">サイズA2</button>
</div>
```

### `selectButton(code)` の挙動

- `.js-variant-btn` のうち `data-code === code` のもの → `disabled = true` かつ `classList.add("is-selected")`
- それ以外 → `disabled = false` かつ `classList.remove("is-selected")`

### ファクトリ呼び出し時の初期化副作用

`createButtonSwitcher()` を呼んだ瞬間に:

1. `picker` の `data-initial-code` 属性を読む
2. その値で `selectButton(initialCode)` を呼ぶ（初期ボタンを選択状態にする）

## 合意済み仕様（この heat で握る挙動）

- `.js-variant-picker` が存在しないとき `null` を返す
- `.js-variant-picker` が存在するとき:
  1. `data-initial-code` 属性を読む
  2. 属性値が空でなければ、`selectButton(initialCode)` を初期化時に実行する
  3. `selectButton` 関数を返す
- `selectButton(code)` は `.js-variant-btn` 全件を走査し、`data-code` 一致で `disabled=true` / `is-selected` を付与、それ以外は外す
- `data-initial-code` が空 or 存在しないとき、初期化の副作用は実行しない（`selectButton` は返す）
- `selectButton` の中で `querySelector` し直さない（クロージャに閉じた `picker` 参照を使う）

## あなたが決めること

実装する前に、自分で以下を決めて JSDoc の【契約】に書く:

### 初期化副作用はいつ実行するか

- `createButtonSwitcher()` の中で `selectButton(initialCode)` を呼ぶ? それとも `selectButton` を返したあと呼び出し側が呼ぶ?
- ファクトリ内で実行する場合、`selectButton` を定義する前に呼べるか? 後に呼べるか? 順序を考えよ

### `data-initial-code` がないとき

- 属性がない、または空文字のとき、初期化副作用は実行しない。なぜか?
- 「属性なし = 初期選択状態なし」として扱うのか「最初の button を初期選択にする」のか? 仕様ではどちらか?

### ボタン状態の同期方法

- `disabled` と `classList` の両方を変える理由は何か?
- 一方だけでは何が足りないか?

### null を返す条件

- heat-1 と同じく、picker がないとき `null` を返す。
- 「picker あり、`data-initial-code` なし」は `null` を返すべきか、関数を返すべきか?

## JSDoc【契約】を書く考え方

4問に答えてから `kata.ts` の【契約】に書く。詳細は [README.md](../../../README.md) の「契約を書く考え方（4問）」。

| # | 質問 |
|---|------|
| 1 | **正常時** — picker あり + initial-code あり のとき、ファクトリを呼んだ後 DOM はどうなっている？ |
| 2 | **困った入力** — picker なし、initial-code なし or 空 |
| 3 | **しないこと** — 例外を投げる？ 呼び出し側に初期化を要求する？ |
| 4 | **暗黙の決め** — 初期化副作用をファクトリ内で行う順序、initial-code 空のスキップ理由 |

### この heat への当てはめ（問いのみ）

- **正常時**: `createButtonSwitcher()` 直後に `data-initial-code` のボタンが選択状態になっているか?
- **困った入力**: picker なし → null。initial-code 空 → 副作用なしで関数を返す?
- **しないこと**: 呼び出し側に「初期化は自分で呼んでね」と要求する?
- **暗黙の決め**: 副作用の実行タイミング（return の前か後か）

副作用をファクトリに含める設計の意図は【設計の読解】へ。

## 設計の問い（実装前に考える）

この heat の本質は **「初期化の副作用をファクトリ呼び出しに含めることで、呼び出し側を簡潔にする」** こと。

- もし初期化副作用をファクトリに含めないと、呼び出し側（`initListingVariationPicker` 相当）はどう書く必要があるか?
- ファクトリが副作用を持つことで、「単体テスト」はどう複雑になるか? それは許容できるか?
- 「作るだけで初期 UI が整う」モジュールにすることの、保守上のメリット・デメリットは何か?

実装が終わったら spec.md で答え合わせをする。

## 進め方

1. このファイルだけ読んで `kata.ts` を実装する
2. 実装が終わったら `spec.md` を開いて自分の判断と突き合わせる
3. `npx vitest forge-08-factory-init-closure/heat-2` でテストを通す
