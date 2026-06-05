# [heat-3] 複数ファクトリを合成するコーディネーター

## 実務での使われ方

`initListingVariationPicker`（`listing-variation-entry.ts`）は、`createGalleryVariationSync()` と `createCartVariationSync()` の結果を受け取り、`.js-goods-variation_buttons` へのクリックイベントで両方を呼ぶ。

各ファクトリは「自分のページに必要な DOM がなければ null を返す」設計なので、コーディネーターは `if (syncGallery)` / `if (syncCart)` でガードするだけでよい。どのページに何が存在するかを知る必要がない。

## やりたいこと

heat-1 の `createBlockSwitcher` と heat-2 の `createButtonSwitcher` を合成し、`.js-variant-picker` 上のクリックで両方を呼ぶエントリポイント `initVariantPicker` を作る。

## 入出力

```ts
// スタブ（変更不要）
declare function createBlockSwitcher(): ((code: string) => void) | null;
declare function createButtonSwitcher(): ((code: string) => void) | null;

function initVariantPicker(): void
```

- 引数: なし
- 戻り値: `void`（副作用のみ）

### 対象 DOM

```html
<div class="js-variant-picker" data-initial-code="ST-A1">
  <button class="js-variant-btn" type="button" data-code="ST-A1">A1</button>
  <button class="js-variant-btn" type="button" data-code="ST-A2">A2</button>
</div>
<div class="js-variant-blocks">
  <div class="js-variant-block" data-code="ST-A1">...</div>
  <div class="js-variant-block" data-code="ST-A2">...</div>
</div>
```

### クリック時の挙動

1. クリックターゲットから `[data-code]` 属性を持つ祖先要素（または自身）を探す
2. `data-code` 属性値を取得する
3. `showBlock(code)` が存在すれば呼ぶ
4. `selectButton(code)` が存在すれば呼ぶ

## 合意済み仕様（この heat で握る挙動）

- `initVariantPicker()` 呼び出し時に `createBlockSwitcher()` と `createButtonSwitcher()` を呼ぶ
- `.js-variant-picker` にクリックイベントリスナーを登録する
- クリック時: `e.target` から `closest("[data-code]")` で `[data-code]` 要素を探す
- `[data-code]` 要素が見つからなければ何もしない
- `[data-code]` 要素が見つかった場合:
  - `showBlock` が null でなければ `showBlock(code)` を呼ぶ
  - `selectButton` が null でなければ `selectButton(code)` を呼ぶ
- `.js-variant-picker` が存在しないとき、イベントリスナーを登録しない（エラーにしない）
- `createBlockSwitcher` と `createButtonSwitcher` は引数としてスタブが渡される（テスト可能にするため DI する）

## あなたが決めること

実装する前に、自分で以下を決めて JSDoc の【契約】に書く:

### ファクトリ呼び出しのタイミング

- `createBlockSwitcher()` と `createButtonSwitcher()` をいつ呼ぶ? クリックのたびか、初期化時か?
- イベントリスナーの外か中か? それぞれで何が変わるか?

### null ガードの書き方

- `showBlock` が `null` の可能性を、どのタイミングで確認する?
- `if (showBlock) showBlock(code)` と `showBlock?.(code)` の違いは何か?

### closest の戻り値の扱い

- `e.target.closest("[data-code]")` が `null` を返す可能性がある。どう扱うか?
- `getAttribute` が `null` を返す可能性もある。どう扱うか?

### DI（依存性注入）の形式

- このファクトリでは `createBlockSwitcher` と `createButtonSwitcher` を引数として受け取る。
- なぜ直接 import して使わず、引数で受けるのか? テストにどう影響するか?
- 引数のデフォルト値はどう設定する?

## JSDoc【契約】を書く考え方

heat-3 はオーケストレーター（複数の下位関数に処理を委譲する関数）。

【契約】はこの関数だけが決めること（イベント登録の有無、null ガードの責任）に絞る。
下位関数（showBlock / selectButton）の挙動はそれぞれの heat で保証済み。

| # | 質問 |
|---|------|
| 1 | **正常時** — picker あり・両ファクトリあり のとき、クリックで何が起きる？ |
| 2 | **困った入力** — picker なし、showBlock が null、selectButton が null |
| 3 | **しないこと** — 下位関数の挙動を自分で実装する？ クリック以外のイベントを登録する？ |
| 4 | **暗黙の決め** — ファクトリ呼び出しをイベントの外でやる、null は if でガード |

### この heat への当てはめ（問いのみ）

- **正常時**: クリックで両関数が呼ばれているか? ターゲットが `[data-code]` でないとき何もしないか?
- **困った入力**: picker なし → リスナー未登録。showBlock/selectButton が null → 呼ばない
- **しないこと**: ファクトリ内で `querySelector` をやり直す？
- **暗黙の決め**: `createBlockSwitcher()` の呼び出し場所（イベントの外）、null ガードの方法

DI にする理由は【設計の読解】へ。

## 設計の問い（実装前に考える）

この heat の本質は **「各ファクトリが null を返す設計が、コーディネーターをどれだけシンプルにするか」** の体感。

- もし `createBlockSwitcher` が null ではなく no-op を返す設計だったら、このコードはどう変わるか?
- `createBlockSwitcher` と `createButtonSwitcher` を引数で受ける（DI する）ことで、テストにおいて何が容易になるか?
- このコーディネーターが「ページに何が存在するか」を知る必要がないのはなぜか?

実装が終わったら spec.md で答え合わせをする。

## 進め方

1. このファイルだけ読んで `kata.ts` を実装する
2. 実装が終わったら `spec.md` を開いて自分の判断と突き合わせる
3. `npx vitest forge-08-factory-init-closure/heat-3` でテストを通す
