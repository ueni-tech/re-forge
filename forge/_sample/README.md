# _sample — forge 作成リファレンス

## この README の読者と目的（forge 作成用 AI 向け）

**読者:** 新しい `forge-XX-<theme>/` をこのリポジトリに追加する AI。

**親リポジトリ（re-forge）の目的:**  
実務で出会うコードのパターンを **1 テーマずつ切り出し**、学習者が **`kata.ts` を自分の手で実装**して理解を深めるための deliberate practice 用リポジトリです。テストは仕様の固定点として機能し、実装の正しさを検証します。

**forge と heat の意味:**

| 用語 | 意味 |
|------|------|
| **forge** | 1 つの学習テーマ（例: クロージャ、キャッシュ、非同期の世代管理）。ディレクトリ `forge-XX-<theme>/` が 1 forge に対応する。 |
| **heat** | 同一テーマを **抽象度・難易度を段階的に上げた** 練習単位。通常 `heat-1` → `heat-2` → `heat-3` の順で進む。 |

**この `_sample` の役割:**  
「正しい forge の形」の **参照実装・規約の典拠** です。新規 forge を作るときは、ここに示す **ディレクトリ構成・ファイル名・`kata.ts` / `kata.test.ts` の書き方・heat ごとの段階設計** に揃えること。`_sample` 自体はユーザーが解く課題ではなく、AI が新 forge の雛形を生成するときのテンプレート説明書として読む。

**新規 forge を作る AI が達成すべきこと:**

1. `forge-XX-<theme>/` を追加し、各 heat に `kata.ts` と `kata.test.ts` を置く。
2. `kata.ts` は **スタブ＋課題コメント**（未実装は `throw new Error("not implemented")` 等）まで用意し、**解答コードはユーザーの学習領域に混ぜない**（別ファイルに分ける方針の forge がある場合は親 README / 既存 forge に合わせる）。
3. `kata.test.ts` は **Vitest** で、**日本語で仕様を記述**した `describe` / `it` と、各 heat で **3〜4 本程度**のテストで要件を固定する。
4. heat の段階は **意味のある漸進** にする（例: 同期最小 → 非同期・時間 → DI）。この README の「heat の役割」表を踏襨する。

---

## ディレクトリ構成

```
forge-XX-<theme>/
├── heat-1/
│   ├── kata.ts       ← 実装ファイル（ユーザーが解く前は throw new Error）
│   └── kata.test.ts  ← テスト（AI が作成、ユーザーは変更しない）
├── heat-2/
│   └── ...
└── heat-3/
    └── ...
```

## heat の役割

| heat | 特徴 |
|------|------|
| heat-1 | クロージャで状態を持つ最小実装 |
| heat-2 | 非同期・タイマーを追加（`vi.useFakeTimers()` 使用） |
| heat-3 | DI（依存性注入）を追加し、実装を外から差し替え可能にする |

## kata.ts の規約

```typescript
// [heat-N] 短い説明（1行）
// createXxx() を実装せよ。
// 返却された関数は:
//   ① ...
//   ② ...

// スタブ（変更不要）
export function fakeXxx(...): void { ... }

export type SomeType = { ... };

export function createXxx(...) {
  // ここに実装する
  throw new Error("not implemented");
}
```

## kata.test.ts の規約

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createXxx } from "./kata";

describe("[heat-N] createXxx", () => {
  it("日本語で仕様を記述する", () => { ... });
  // 3〜4テスト
});
```

- fake timers を使う場合は `beforeEach(() => vi.useFakeTimers())` と `afterEach(() => vi.useRealTimers())`
- DI を持つ heat-3 では `vi.fn()` でスタブを差し替えてテストする

## このサンプルのテーマ: キャッシュ（cache）

この節は **本サンプルが具体例として採っているテーマ** のメモです。新規 forge では別テーマに差し替えてよいが、**heat の段階的な積み上げ方** の参考にする。

| heat | 関数 | 追加要素 |
|------|------|----------|
| heat-1 | `createCache<V>()` | クロージャで Map を保持 |
| heat-2 | `createTTLCache<V>(ttl)` | TTL 期限切れ + fake timers |
| heat-3 | `createAsyncCacheLoader(storage, validKeys, fetcher?)` | DI + 非同期フェッチ |

## テスト実行（リポジトリルートから）

```bash
npx vitest forge-XX-<theme>
npx vitest forge-XX-<theme>/heat-1
```

（詳細はリポジトリ直下の `README.md` を参照。）
