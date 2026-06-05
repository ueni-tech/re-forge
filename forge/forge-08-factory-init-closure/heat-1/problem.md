# [heat-1] DOM をキャプチャしてハンドラを生成する

## 実務での使われ方

商品バリエーション選択ページでは、ユーザーがバリエーションボタンを押すたびに「カートに入れる」ブロックを対応する SKU に切り替える処理がある（`createCartVariationSync` / `listing-variation-cart.ts`）。

バリエーション切り替えのたびに `document.querySelector` を毎回呼ぶのではなく、**初期化時に一度だけ DOM を取得してクロージャに保持し**、ハンドラ関数として返す。

バリエーション UI が存在しないページ（バリエーションなし商品の詳細ページ等）では、対象 DOM がないので `null` を返して呼び出し側に「この同期は不要」と伝える。

## やりたいこと

`.js-variant-blocks` コンテナを初期化時に一度だけ取得し、`showBlock(code)` を呼ぶたびにコンテナ内の `.js-variant-block[data-code]` を表示・非表示に切り替える関数 `createBlockSwitcher` を作る。

コンテナが存在しないときは `null` を返す。

## 入出力

```ts
function createBlockSwitcher(): ((code: string) => void) | null
```

- 引数: なし（DOM から取得する）
- 戻り値:
  - `.js-variant-blocks` が存在する → `showBlock(code: string) => void`
  - 存在しない → `null`

### `showBlock(code)` の挙動

対象 DOM:

```html
<div class="js-variant-blocks">
  <div class="js-variant-block" data-code="ST-A1">...</div>
  <div class="js-variant-block" data-code="ST-A2">...</div>
</div>
```

- `.js-variant-block` のうち `data-code === code` のもの → `hidden = false`（表示）
- それ以外 → `hidden = true`（非表示）

## 合意済み仕様（この heat で握る挙動）

- ファクトリ呼び出し時（`createBlockSwitcher()` 実行時）に `.js-variant-blocks` を `querySelector` する
- `.js-variant-blocks` が存在しないとき、`null` を返す（例外は投げない）
- `.js-variant-blocks` が存在するとき、`showBlock` 関数を返す
- `showBlock(code)` は、`.js-variant-block` 全件を走査し、`data-code` が一致するものを表示、それ以外を非表示にする
- `code` に対応する `data-code` を持つブロックが存在しないとき、全件が `hidden = true` になる
- `showBlock` は呼ぶたびに同じコンテナ参照を使い回す（再 `querySelector` しない）

## あなたが決めること

実装する前に、自分で以下を決めて JSDoc の【契約】に書く:

### null を返す条件

- `createBlockSwitcher()` を呼んだとき DOM にコンテナがなかったら何を返す?
- `null` と「何もしない no-op 関数」のどちらを返すべきか? それぞれ呼び出し側への影響は?

### キャプチャのタイミング

- `querySelector` をファクトリ呼び出し時にやるのか、`showBlock` を呼ぶたびにやるのかで、何が変わるか?
- ファクトリ呼び出し後に DOM が変化したとき、それぞれの戦略でどう挙動が変わるか?

### hidden の扱い

- `hidden` 属性で表示制御する。これは `display: none` と何が違うか?
- `data-code` に一致するものがないとき（unknown code）、全件非表示にするのは正しいか? 代替案は?

### 戻り値の型

- `((code: string) => void) | null` のユニオン型にした理由を自分の言葉で説明できるか?

## JSDoc【契約】を書く考え方

4問に答えてから `kata.ts` の【契約】に書く。詳細は [README.md](../../../README.md) の「契約を書く考え方（4問）」。

| # | 質問 |
|---|------|
| 1 | **正常時** — コンテナが存在するとき何が返る？ `showBlock` を呼んだ後 DOM はどうなる？ |
| 2 | **困った入力** — コンテナ不在、`code` に対応するブロックなし |
| 3 | **しないこと** — 例外を投げる？ `showBlock` のたびに `querySelector` し直す？ |
| 4 | **暗黙の決め** — null vs no-op、コンテナ参照を閉じる vs 毎回取る |

### この heat への当てはめ（問いのみ）

- **正常時**: コンテナありなら関数を返す。`showBlock("ST-A1")` で ST-A1 だけ表示、他は非表示になっているか?
- **困った入力**: コンテナなし → null。unknown code → 全件非表示?
- **しないこと**: DOM の存在確認を `showBlock` の中でやる? `querySelector` を毎回呼ぶ?
- **暗黙の決め**: null か no-op か、その選択の根拠

キャプチャをファクトリ内でやる理由は【設計の読解】へ。

## 設計の問い（実装前に考える）

この heat の本質は **「初期化とイベント処理を分離する」** こと。

- `querySelector` をファクトリの中でやる設計と、`showBlock` の中で毎回やる設計では、何が違うか?
- コンテナ不在を `null` で表現する設計と、no-op 関数を返す設計では、呼び出し側のコードがどう変わるか?
- このファクトリが「同じコンテナに対して複数回 `showBlock` を呼ぶ」前提で設計されていることを、コードのどこから読み取れるか?

実装が終わったら spec.md で答え合わせをする。

## 進め方

1. このファイルだけ読んで `kata.ts` を実装する
2. 実装が終わったら `spec.md` を開いて自分の判断と突き合わせる
3. `npx vitest forge-08-factory-init-closure/heat-1` でテストを通す
