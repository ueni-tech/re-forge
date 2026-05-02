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

## 仕様の明記（暗黙仕様を作らない）

**目的:** 学習者と次の AI が **テストを逆算する必要なく** `kata.ts` だけで課題を理解できるようにする。テストが要求しているのにコメントに書いていない前提は **暗黙仕様** とみなし、作らない。

**AI が新規 forge / heat を書くときのルール:**

1. **`kata.ts` 先頭の課題コメントを唯一の仕様書とする**  
   テストはその固定点として振る舞う。テストだけが詳しい・コメントが曖昧、という状態にしない。

2. **数値・式・順序は書き切る**  
   遅延時間の決め方、`delay` の計算式、dispatch の順序、`advanceTimersByTime` と整合する前提など、**テストの成否に効く定数・規則はコメントに明示**する。コメントに「例として遅い／早い」だけ書き、実際の ms や式を別にある、は避ける。

3. **スタブ・DI の契約を明示**  
   `fakeLoad` / `fakeRequest` などに **誰がどの引数を決めるか**、完了時にコールバックへ渡る **文字列やデータの形**、古いリクエストで **ユーザー callback を呼ぶ／呼ばない** など、スタブと実装の分割があれば文章で書く。

4. **非同期・エラーの扱い**  
   「棄却された Promise は `reject` か `null` で `resolve` か」「ヒットしなかったときは callback を呼ばないか」など、テストが暗に決めている分岐を仕様に書く。

5. **ミュータブルか・スキップ条件の境界**  
   配列やオブジェクトを **その場で更新するか新しく返すか**、`""` だけを特別扱いするか **空白文字列はどうか**、省略可能な依存は **`undefined` のとき呼ばない** など、テストが検証している境界を文章化する。

6. **純粋関数・reducer などの意味**  
   各 `Action` が state のどのフィールドをどう変えるか、`isValidState` の定義とテストの「各ステップで valid」の関係が一目でわかるように、**型とテストの間に仕様を挟む**。

7. **テスト側のコメント**  
   `kata.ts` に書いた式・数値と **矛盾する短いコメント**（誤った ms のメモなど）をテストに残さない。テスト内の補足は、`kata.ts` の仕様と整合する説明に限定する。

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
