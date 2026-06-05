# [heat-1] spec.md — 答え合わせ用

**注意: kata.ts を実装してから開くこと。**

## 仕様の一次ソース

この heat の「合意済み仕様（握る挙動）」は `problem.md` に明記されている。
`spec.md` は仕様そのものではなく、設計の観察ポイント・判断の背景・代替案の比較を担う。

## 自分の契約と比較する観点

4問（正常時 / 困った入力 / しないこと / 暗黙の決め）を【契約】に書けていたか確認する。

### null vs no-op: 前提の不在をどう表現するか

「コンテナが存在しない」という前提の不在を、`null` と「何もしない関数（no-op）」のどちらで表現するかは設計上の選択。

**no-op を返す場合**:
```ts
return () => {}; // 何もしない
```
- 呼び出し側に `null` チェックを書かせない
- 問題: コンテナがないのに「正常終了した」と見える。バグを気づきにくくする

**null を返す場合**:
```ts
return null;
```
- 呼び出し側: `if (switcher) { switcher(code); }`
- 明示的。「この関数は使えない」という情報が呼び出し側に渡る

実務コード（`createCartVariationSync`）は `null` を選んでいる。これは呼び出し側の `initListingVariationPicker` が `if (syncCart)` で分岐しているから成立する設計。**「存在しない」を `null` で表す選択は、呼び出し側に判断を委ねる**。

### querySelector をキャプチャする vs 毎回呼ぶ

```ts
// ファクトリ内でキャプチャ（今回の設計）
export function createBlockSwitcher() {
  const container = document.querySelector(".js-variant-blocks"); // 1回だけ
  if (!container) return null;
  return function showBlock(code: string) {
    container.querySelectorAll(...) // container は閉じた参照
  };
}

// showBlock のたびに取得する設計
export function createBlockSwitcher() {
  return function showBlock(code: string) {
    const container = document.querySelector(".js-variant-blocks"); // 毎回
    if (!container) return;
    container.querySelectorAll(...)
  };
}
```

毎回取得する設計の問題:

1. **パフォーマンス**: クリックのたびに DOM 全体を走査する
2. **null チェックが内側に移る**: ファクトリが常に関数を返すので「コンテナ不在」を呼び出し側から隠す
3. **テストしにくい**: コンテナ不在のケースを「ファクトリ呼び出し時に確認」できない

今回の設計では `null` が返った時点で「このページにはコンテナがない」と確定する。**初期化の成功・失敗をファクトリの戻り値で表現する**のがポイント。

### クロージャに何を閉じるか

```ts
const container = document.querySelector(".js-variant-blocks");
// ↑ この参照が showBlock の中から見える
```

`showBlock` は `container` 変数をクロージャ経由で参照する。`container` は `HTMLElement` への参照なので、DOM が変更されても（子要素の追加・削除など）コンテナ自体を参照し続けられる。

**閉じているのは「参照」であって「スナップショット」ではない**。これは重要な違いで、`showBlock` を呼ぶたびに `.js-variant-block` を `querySelectorAll` し直しているのは、子要素の増減に対応するため。

### hidden 属性で制御する意味

```ts
el.hidden = el.getAttribute("data-code") !== code;
```

`hidden` 属性（`element.hidden = true/false`）は `display: none` と同等の効果を持つが、HTML の標準属性。`display` は CSS であり、スタイルシートで上書きできてしまう。`hidden` は HTML の意味的な状態として「非表示」を表す。

ただし CSS で `[hidden] { display: block !important; }` などが当たっていると `hidden` が無効になるケースもある。どちらを選ぶかはプロジェクトの CSS の設計方針による。

## 観察ポイント: 初期化 = 「文脈の確立」

このファクトリの構造を図で示す:

```
createBlockSwitcher() 呼び出し時:
  ↓ querySelector → container を確立
  ↓ null チェック → 前提を確認
  ↓ showBlock 関数を生成（container を閉じる）
  → 関数 or null を返す

showBlock(code) 呼び出し時:
  ↓ クロージャ経由で container を参照（再取得しない）
  ↓ 全 .js-variant-block を走査
  → 表示・非表示を更新
```

**ファクトリ呼び出し = 文脈（context）の確立**。イベントハンドラ = 確立された文脈の中での処理。

この分離が heat-2 でさらに重要になる。「初期化時に一度やること」が増えてくる。
