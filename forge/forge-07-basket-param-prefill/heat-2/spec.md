# [heat-2] spec.md — 答え合わせ用

**注意: kata.ts を実装してから開くこと。**

## 想定仕様

### `parsePrefillData(raw)`

① `raw` が falsy (`null` / `undefined` / `""`) のとき `undefined` を返す。

② `JSON.parse` に失敗したとき `undefined` を返す（例外は外に出さない）。失敗の事実は `console.warn` などでログに残してもよい。

③ 成功時はパース済みオブジェクトを `PrefillData` として返す。**ランタイムの形状検証は行わない**。

### `getPrefillValue(el, prefillData)`

① `el` が `null` / `undefined` のとき `undefined`。

② `el.name` が `undefined` / `""` のとき `undefined`。

③ `el.name` が正規表現

```
/^param\[([^\]]+)\]\[[^\]]*\]\[[^\]]*\]\[([^\]]+)\]$/
```

にマッチしないとき `undefined`。`match[1] = listingCode`、`match[2] = templateName`。

④ `prefillData[listingCode]` または `prefillData[listingCode][templateName]` が存在しないとき `undefined`。

⑤ 上記をすべてパスしたとき `prefillData[listingCode][templateName]` を返す。

## 自分の契約と比較する観点

`parsePrefillData` / `getPrefillValue` それぞれについて、4問（正常時 / 困った入力 / しないこと / 暗黙の決め）を【契約】に書けていたか確認する。

### 「パース」と「解析」を分ける設計

両方をひとつの関数 `getPrefillValueFromRaw(raw, el)` にまとめることもできた。なぜ分けたか:

- パースは**プロセス内で一度だけ**やればいい（sessionStorage を毎回読み直す必要はない）
- キー解析は**要素ごと**に発生する
- 計算量の単位が違う処理を分けると、呼び出し側で「パース結果をループの外でキャッシュ」が自然に書ける

```ts
// 想定される呼び出し側
const prefillData = parsePrefillData(sessionStorage.getItem("..."));
if (!prefillData) return;
elements.forEach(el => {
  const val = getPrefillValue(el, prefillData);
  // ...
});
```

`parsePrefillData` を内側に隠していたら、要素ごとに `JSON.parse` を呼ぶ実装になりかねない。**責務の分離は、パフォーマンスの分離でもある**。

### 「失敗を握りつぶす」設計の正当化

`parsePrefillData` が `try/catch` で握りつぶし `undefined` を返す選択。一般には「**例外を握りつぶすな**」と言われる。それでもここで正当化される理由:

1. **入力源が信頼できない**: sessionStorage の値は、外部要因（古いバージョンの残骸、別タブからの書き換え、開発者ツールでの編集など）で壊れていてもおかしくない
2. **失敗してもユーザー体験が大きく損なわれない**: prefill ができないだけで、フォーム自体は使える
3. **代替動作が明確**: 「データなし = prefill なし」という挙動が成立する

つまり「**失敗してもアプリが継続できる**」かつ「**失敗が運用上の現実として起こりうる**」ときに、握りつぶしは正当化される。

逆に言えば、`fetch` のレスポンスのように「失敗を呼び出し側に伝える必要がある」コンテキストでは握りつぶしてはいけない。**「いつ握りつぶしていいか」を判別できることが、シニアの設計判断**。

### ランタイム形状検証をしない判断

`JSON.parse(raw) as PrefillData` という型アサーション。これは TypeScript 的にも危険な箇所:

- `raw` が `'"hello"'` だった場合、`PrefillData` ではなく `string` が返る
- `raw` が `'[1,2,3]'` だった場合、配列が返る

それでも検証していない理由:

- データの生成元が**自分たち**（heat-1 で書き込んだ自前のコード）
- 第三者が書き換えるリスクは「sessionStorage の手動編集」程度
- 検証コードを書くと依存（zod 等）が増え、行数も膨らむ

**「信頼境界の内側」と「外側」を区別する**。生成元と消費先が同じプロセス・同じコードベースなら、検証を省略できる。外部 API のレスポンスのように境界をまたぐデータは検証が必要。

### 正規表現 vs split

正規表現を選んだ理由:

```ts
/^param\[([^\]]+)\]\[[^\]]*\]\[[^\]]*\]\[([^\]]+)\]$/
```

- `^...$` で「**全体が想定した4階層形式**」であることを保証
- 階層数が違う `name` (`param[a][b][c]` など) は自動的に弾かれる
- キャプチャグループで「使う階層」だけ取り出せる

`split('[')` で分解すると:

- 階層数の検証を自前で書く必要がある
- 末尾の `]` を取り除く後処理が必要
- 「3階層しかない」「5階層ある」のとき、何階層目を使うべきかコードから読み取りにくい

`name` 属性のように **「形が決まっている文字列」を扱うときは、正規表現の方が「形ごと検証できる」** という利点がある。

### ガード順序と多段早期 return

想定仕様は多段の早期 return:

```ts
if (!el) return undefined;
if (!el.name) return undefined;
const match = el.name.match(/.../);
if (!match) return undefined;
if (!prefillData[listingCode]) return undefined;
if (!prefillData[listingCode][templateName]) return undefined;
return prefillData[listingCode][templateName];
```

ネストすると「正常系の本体が深いインデントに沈む」。早期 return は **「異常系を上で潰し、正常系は最後にフラットに書く」** という構造を作る。

TypeScript の `Optional chaining` (`prefillData[listingCode]?.[templateName]`) で2行に圧縮もできるが、想定仕様はあえて多段で書いている。理由は「**どこで弾かれたかが分かりやすい**」「**ログを後から差し込みやすい**」など、保守性側を重視した判断。

## 観察ポイント: 「層の境界」を関数で表現する

```
[sessionStorage 文字列]
        ↓ parsePrefillData
[PrefillData オブジェクト]
        ↓ getPrefillValue
[個別の prefill 値]
```

各関数は、入力と出力の型が **異なるレイヤーを変換する**:

- `parsePrefillData`: 文字列 → 構造化オブジェクト
- `getPrefillValue`: 構造化オブジェクト + 要素 → 値

関数の境界は **「変換が必要なレイヤーの境目」** にある。「**型が変わるところに関数を切る**」という発想。

heat-1 では「DOM 要素配列 → payload オブジェクト」という変換だった。これも同じパターン。
