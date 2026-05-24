# [heat-3] 非同期キャッシュローダー — DI と非同期

## 実務での使われ方

タブやフィルタごとにデータを fetch しつつ、一度取れた結果はメモリに載せて再訪問時は同期的に返す、といった「**許可キーのみ fetch・それ以外は無視**」のデータ取得ゲート。

heat-1, heat-2 と異なり、保存先(`storage`)と取得手段(`fetcher`)を**外から注入**できる。これによりテスト可能になり、本番では LocalStorage や実 API に差し替えられる。

## やりたいこと

許可されたキーだけを対象に、

- 保存済みなら**同期で** callback に渡す
- 未保存なら fetcher を呼び、完了後に保存してから callback に渡す

という load 関数を生成するファクトリを作る。

## 入出力

```ts
type Storage = {
  get: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
};

// デフォルト fetcher(差し替え可能)
function fakeFetch(
  key: string,
  delay: number,
  cb: (result: string) => void,
): void;

function createAsyncCacheLoader(
  storage: Storage,
  validKeys: string[],
  fetcher?: typeof fakeFetch,
): (key: string, delay: number, callback: (result: string) => void) => void;
```

## あなたが決めること

実装する前に、自分で以下を決めて JSDoc の【契約】と【設計の読解】に書く:

### 許可されていないキーの扱い

- `validKeys` に含まれないキーで `load` が呼ばれたら、何をする?
- callback は呼ぶ? 呼ばない? 例外を投げる?
- 「何もしない」を選んだ場合、なぜそれが安全か。
- 「例外を投げる」を選んだ場合、呼び出し側に何を要求することになるか。

### キャッシュヒット時の同期/非同期

- `storage.get(key)` で値が取れたとき、callback は**同期的に**呼ぶ? `setTimeout(cb, 0)` で**非同期化**する?
- どちらでも実装できる。差を考える。

### fetcher 完了後の順序

- fetcher が完了したとき、「`storage.set` してから callback」か、「callback してから `storage.set`」か。
- 順序を逆にすると、callback の中で再 `load` した場合に何が起こるか?

### DI されている依存

このheatでは `storage` と `fetcher` が引数で渡される。

- なぜ `storage` を引数で受けるのか? もし関数内で直接 `localStorage` を呼んでいたら、何が困るか?
- なぜ `fetcher` にデフォルト値 `fakeFetch` を持たせているのか?
- なぜ `validKeys` は load の引数ではなく、ファクトリの引数にしているのか?

## JSDoc【契約】を書く考え方

4問に答えてから【契約】に書く。【設計の読解】は DI の理由向け。詳細は [_sample/README.md](../README.md)。

| # | 質問 |
|---|------|
| 1 | **正常時** — キャッシュヒット / ミス時、callback には何がいつ渡る？ |
| 2 | **困った入力** — 許可外キー、storage に無いキー、fetcher 失敗時 |
| 3 | **しないこと** — 許可外キーで callback を呼ぶ？ 例外を投げる？ |
| 4 | **暗黙の決め** — ヒット時は同期か非同期か、`set` と callback の順序 |

### この heat への当てはめ（問いのみ）

- **正常時**: 保存済みキーと未保存キーで load の振る舞いは？
- **困った入力**: `validKeys` に無いキーで load が呼ばれたら？
- **しないこと**: 許可外キーで fetcher / callback を動かす？
- **暗黙の決め**: キャッシュヒット時 callback は同期的？ fetch 完了後 set と callback の順序は？

## 設計の問い(実装前に考える)

このheatの本質は **「DI(依存性注入)の本当の意味」** を体感すること。

DIは「テストを書きやすくするテクニック」と説明されがちだが、もう一段深い意味がある。

- 依存を引数で受けると、**関数の責務が型レベルで明示される**
- シグネチャを見るだけで「この関数は何に依存しているか」が分かる
- 関数内で `localStorage` や `fetch` を直接呼ぶと、シグネチャからは依存が見えない

実装が終わったら、**「もし storage を引数にせず、関数内で localStorage を直接呼んでいたら、このテストはどう書けただろうか」** を考えてみる。それが DI の価値を体で理解する瞬間。

## 進め方

1. このファイルだけ読んで `kata.ts` を実装する
2. 実装が終わったら `spec.md` を開いて自分の判断と突き合わせる
3. `npx vitest forge-01-closure/heat-3` でテストを通す
