# [heat-2] spec.md — 答え合わせ用

**注意: kata.ts を実装してから開くこと。**

## 自分の契約と比較する観点

### カスケードの順序

径を先に直してから行数を判定する。逆だと、**古い径を前提にした行数フォールバック** になりうる。

```
色変更 → 径が無効? → 最小径へ
       → 行数が無効? → （修正後の径で）最小行数へ
```

### 同型ブロック2回

実コードも径・行数でほぼ同じ形:

```
if (state.axis !== undefined) {
  if (!has...(state, skus, state.axis)) {
    const next = pickMin(collect...(skus, ...));
    if (next !== undefined) state.axis = next;
  }
}
```

**抽象化（ループ化）しなくてよい** 段階。2回書いてパターンを体に覚えさせる。

### ミュータブル state

forge-12 の `patchState` と同様。フォールバックは **イベント1回の中での中間修正**。

## 観察ポイント

オーケストレーション（`applyResolvedSelection`）の前段。ここを理解すると「なぜ resolve の前に fallback か」が言語化できる。
