# [heat-3] spec.md — 答え合わせ用

**注意: kata.ts を実装してから開くこと。**

## 想定仕様

### `getStrategyKey(el)`

① `el.type` が `"radio"` または `"checkbox"` のとき `"checked"` を返す。

② それ以外（`"text"` や `undefined` など）のとき `"default"` を返す。

### `initForm(form, prefillData)`

① `form` が `null` / `undefined` のとき何もしない（return）。例外は投げない。

② `prefillData` が `null` / `undefined` のとき何もしない（return）。

③ `form.querySelectorAll('[name^="param["]')` で対象要素を取得する。

④ 各要素について `getPrefillValue(el, prefillData)` で値を取り出す。

⑤ 値が取れた要素のみ、`applyStrategies[getStrategyKey(el)] ?? applyStrategies.default` で適用する。

## 自分の契約と比較する観点

### キーを返す vs 関数を返す

`getStrategyKey` は文字列を返す。一見冗長に見える:

```ts
// 想定仕様
const strategy = applyStrategies[getStrategyKey(el)];
strategy(el, val);

// 関数を直接返す代替案
const strategy = pickStrategy(el);
strategy(el, val);
```

なぜキーを返す形か:

- **デバッグ可能性**: ログに `"checked"` という文字列が残ると、どの Strategy が選ばれたかが追える
- **テーブルの可視性**: `applyStrategies` という単一の場所に「全パターン」が並んでいる
- **シリアライズ可能**: キーは設定ファイル・URL パラメーター・サーバーから受け取った値などにできる

「**何を選ぶか**」と「**選んだものを実行する**」を分ける設計。中間に「キー」という名前空間を挟むことで、参照を後から差し替えやすくなる。

### Strategy テーブルの効果

新しい input タイプを追加する場合:

```ts
applyStrategies.range = (el, val) => {
  el.value = val;
  el.dispatchEvent(new Event("input"));
};
```

`initForm` 本体は1行も変えない。`getStrategyKey` も、`"range"` を返すケースを追加するだけ。

`if (el.type === "radio") { ... } else if (el.type === "range") { ... } else { ... }` と比べて、**変更箇所の局所性**が圧倒的に高い。

ただし Strategy テーブルにも欠点はある:

- 「いつどの Strategy が選ばれるか」がコードを追わないと分からない
- 型システムでキーの全網羅をチェックしにくい（`Record<string, ...>` のため）

`if/else` の方が「素直で短い」ケースもある。**Strategy が活きるのは、3つ以上の分岐があり、かつ追加・変更の頻度が高いとき**。今回は将来追加の余地を見越して、2分岐の段階から Strategy で書いている。

### `'[name^="param["]'` で絞る理由

`form.querySelectorAll('[name]')` だと、`name` を持つ全要素が取れる。これだと:

- `name="csrf_token"` のような **prefill 対象外**の要素も取れてしまう
- `getPrefillValue` で `undefined` が返るだけだが、**無駄なループとマッチング**が走る
- CSRF トークンなど触りたくない要素にうっかり Strategy を適用するリスク（バグ防止）

`'[name^="param["]'` は **「`param[` で始まる name 属性」** だけを取る CSS セレクタ。これで「prefill 対象の input」だけに絞れる。

セレクタで絞るのは「**走査の責務を、検索の段階で済ませる**」発想。後段（`getPrefillValue`）でフィルタしてもいいが、前段で絞れるなら前段の方が安い・読みやすい・安全。

### `?? applyStrategies.default` の役割

```ts
const strategy = applyStrategies[getStrategyKey(el)] ?? applyStrategies.default;
```

現状の `getStrategyKey` は `"checked"` または `"default"` しか返さない。両方とも `applyStrategies` に存在する。だから **`??` は理論上は不要**。

それでも書く理由は **「将来の自分への保険」**:

- `getStrategyKey` が `"range"` を返すように拡張されたが、`applyStrategies.range` の追加を忘れた場合
- フォールバックがないと `undefined(el, val)` で `TypeError`
- フォールバックがあれば `default` 戦略で素直に動く

「**未定義のキーが来たらクラッシュ**」と「**未定義のキーが来たらフォールバック**」は、両方とも正しい設計判断になりうる。

- ライブラリ・SDK のように呼び出し側を信頼できるとき → クラッシュ（バグ早期発見）
- ユーザー入力や DOM のように予測困難なとき → フォールバック（壊れない優先）

ここでは DOM 側が変わる可能性を見て、フォールバック側を選んでいる。

### `el.click()` を使う理由

```ts
checked(el, val) {
  if (el.value === val) el.click();
}
```

`el.checked = true` ではなく `el.click()` を選ぶ理由:

- `checked` プロパティを直接書き換えても、`change` / `click` イベントは**発火しない**
- 実コードでは「radio が選ばれたら関連 UI を更新する」イベントリスナがある（例: サイズ選択 → 価格表示の更新）
- それらを動かすには、ユーザー操作と同等の `click()` を呼ぶ必要がある

**「UI を更新する」と「状態を変える」は別物**。`checked` への直接代入は後者だけ、`click()` は前者も巻き込む。レガシー jQuery 環境では「`.click()` を呼んで連鎖イベントを再現する」のは常套パターン。

ただしこれは **副作用が連鎖する**設計でもある。理想的には Redux/Vuex のような単方向データフローの方が見通しが良い。実コードの制約下での妥協点として理解する。

### DI の効果（テストとの対比）

`initForm(form, prefillData)` という DI 形式のおかげで、テストはこう書ける:

```ts
const form = { querySelectorAll: vi.fn().mockReturnValue([...]) };
const prefillData = { ... };
initForm(form, prefillData);
expect(el.click).toHaveBeenCalled();
```

もし内部で `document.querySelector` / `sessionStorage.getItem` を直接呼んでいたら:

```ts
// 必要なもの
beforeEach(() => {
  document.body.innerHTML = `<form>...</form>`; // jsdom 必須
  sessionStorage.setItem("...", JSON.stringify({...})); // jsdom 必須
});
afterEach(() => {
  document.body.innerHTML = "";
  sessionStorage.clear();
});
```

**前提のセットアップが激増**する。さらに、**テスト間で状態が漏れる**リスクも増える（`sessionStorage` がグローバル）。

DI の価値は「テストが書きやすい」だけではなく「**テストの前提が最小化される**」こと。前提が少ないテストは、壊れにくく・読みやすく・速い。

## 観察ポイント: heat-1 → heat-2 → heat-3 の進化

| heat | 主題 | 設計パターン |
|------|------|-------------|
| heat-1 | 純粋関数化 | 最小インターフェース型で副作用を切り離す |
| heat-2 | 責務の分離 | パースと解析を別関数に切る |
| heat-3 | 拡張と DI | Strategy テーブル + 依存を引数で受ける |

3つの heat は、**「DOM とロジックがベタ書きされたレガシーコードを、責務ごとに分解する」** というテーマで一貫している。

- heat-1: 「**DOM を触らない核**」を取り出す
- heat-2: 「**変換のレイヤー**」を関数で表現する
- heat-3: 「**分岐**」をテーブルに、「**依存**」を引数に出す

これは「**実コードを読む力**」と「**自分のコードを書く力**」の両方を鍛える練習。レガシーコードを読むときは、この3層がどこに混ざっているかを探す。自分のコードを書くときは、この3層を最初から分けて書く。
