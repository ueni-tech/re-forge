# [heat-2] spec.md — 答え合わせ用

**注意: kata.ts を実装してから開くこと。**

## 仕様の一次ソース

この heat の「合意済み仕様（握る挙動）」は `problem.md` に明記されている。
`spec.md` は設計の観察ポイント・判断の背景・代替案の比較を担う。

## 自分の契約と比較する観点

4問（正常時 / 困った入力 / しないこと / 暗黙の決め）を【契約】に書けていたか確認する。

### 「ファクトリに副作用を含める」設計の正当化

ファクトリ内で `selectButton(initialCode)` を呼ぶのは副作用（DOM の書き換え）を初期化時に起こすこと。これが正当化される理由:

1. **初期状態の整合性**: HTML が出力する初期ボタン状態と JS 管理状態を一致させる必要がある。これは「使う前に必ずやること」であり、「いつやるか」を呼び出し側に委ねると漏れる
2. **呼び出し側がシンプルになる**: `const select = createButtonSwitcher()` の1行で初期化が完了する
3. **タイミングの制御**: ファクトリ内でやることで「selectButton を定義した後に副作用を実行する」順序が保証される

**逆に、副作用を外に出した場合**:

```ts
// 呼び出し側がこうなる
const selectButton = createButtonSwitcher();
if (selectButton) {
  const initialCode = picker.getAttribute("data-initial-code"); // picker を外でも取得する必要がある
  if (initialCode) selectButton(initialCode);
}
```

`picker` の参照が呼び出し側にも漏れる。情報の重複と責務の分散が起きる。

### 副作用の実行順序

```ts
export function createButtonSwitcher() {
  const picker = document.querySelector(".js-variant-picker");
  if (!picker) return null;

  function selectButton(code: string) { ... } // ① 先に定義

  const initialCode = picker.getAttribute("data-initial-code");
  if (initialCode) {
    selectButton(initialCode); // ② 定義後に呼ぶ
  }

  return selectButton; // ③ 最後に返す
}
```

`selectButton` を定義してから呼ぶ、という順序は JavaScript の関数宣言であれば巻き上げ（hoisting）により順序が前後しても動くが、`function expression` の場合は定義後にしか呼べない。**`function` 宣言を使うか `const` に代入するかで、この順序の制約が変わる**。

今回の解答では `function selectButton` という関数宣言を使っている。これにより `picker` が確定した後に副作用を実行できる。

### disabled と is-selected を両方変える理由

```ts
btn.disabled = isActive;
btn.classList.toggle("is-selected", isActive);
```

- `disabled`: フォームの標準属性。`true` のとき button 要素はクリックできない（ユーザーに「今これが選ばれている」と伝える機能的な側面）
- `is-selected`: CSS クラス。スタイル上の「選択中」の見た目を付ける（視覚的な側面）

どちらか一方だけだと:
- `disabled` のみ: 見た目が変わらない（何が選ばれているか分からない）
- `is-selected` のみ: 見た目は変わるが、disabled でないのでもう一度同じボタンを押せてしまう

実務の UI では「機能的な状態」と「視覚的な状態」を両方管理することがよくある。`classList.toggle(class, force)` は第2引数で `add` / `remove` を制御できる。

### data-initial-code が空のときスキップする理由

```ts
const initialCode = picker.getAttribute("data-initial-code");
if (initialCode) {       // null も "" も falsy なのでスキップ
  selectButton(initialCode);
}
```

`getAttribute` は属性が存在しないとき `null` を返し、`data-initial-code=""` のとき `""` を返す。どちらも falsy なので `if (initialCode)` でまとめてスキップできる。

「空文字 = 未設定」として扱う設計。「空文字 = 明示的に全ボタン非選択にする」と解釈するケースもあり得るが、今回の仕様では「初期コードが指定されていなければ初期化副作用なし」として扱う。

## 観察ポイント: ファクトリの3つの役割

heat-1 と heat-2 を比較すると、ファクトリの役割が増えていることに気づく:

| 役割 | heat-1 | heat-2 |
|------|--------|--------|
| DOM をキャプチャする | ✅ | ✅ |
| 前提チェックして null を返す | ✅ | ✅ |
| 初期化副作用を実行する | ❌ | ✅ |
| ハンドラ関数を返す | ✅ | ✅ |

実務の `createGalleryVariationSync` はさらに複数の内部関数を持ち、「品切れ判定」「ステータスメッセージ同期」「ギャラリー画像切り替え」を組み合わせている。heat-2 はその **「初期化副作用をファクトリに含める」** という設計判断だけを切り出している。

```
createButtonSwitcher() 呼び出し時:
  ↓ DOM キャプチャ（picker）
  ↓ null チェック
  ↓ selectButton 定義
  ↓ 初期化副作用（selectButton(initialCode) を実行）← ここが新しい
  → selectButton を返す

selectButton(code) 呼び出し時:
  ↓ クロージャの picker を使って全ボタン走査
  → disabled / is-selected を更新
```

heat-3 では、この「selectButton」と heat-1 の「showBlock」を合成するコーディネーターを作る。
