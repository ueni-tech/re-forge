// [heat-1] data-goods-image-variations 相当の JSON 文字列を安全に読む
//
// 実務での使われ方:
//   HTML の data 属性やサーバー埋め込みに JSON を載せ、クライアントで variation マップを
//   復元するとき。不正・空・型外れを全部例外にせず null に潰し、初期化やハイドレーションを
//   安全に進めるガード付きパース。
//
// parseGoodsImageVariationsJson を実装せよ。
//
// 仕様:
//   - 引数が null / undefined / 空文字のとき null を返す。
//   - JSON.parse に失敗したとき null を返す。
//   - パース結果が null、配列、または typeof が "object" でないとき null を返す。
//   - それ以外は Record<string, unknown> として返す（中身の検証はしない）。
//
// 行き詰まったら kata.solution.ts を参照。

/**
 * 【意図】（呼んだ人は何が嬉しい？／何が手に入る？）
 * - 渡されたデータをパースしてJSON 文字列ならオブジェクトが手に入る
 * - JSON 文字列以外のときはnull が手に入る
 *
 * 【契約】（渡したものに対して、いつ何が起きる／起きない？）
 * - 引数が null / undefined / 空文字のとき null を返す
 * - 引数を JSON.parse し失敗したら null を返す
 * - JSON.parseの結果が null、配列、または typeof が "object" でないとき null を返す。
 * - それ以外は Record<string, unknown> として返す
 *
 * 【判断】（他の書き方と比べて、なぜこの形にした？）
 * unknown を挟むことで TypeScript に map の型の確認を強制させ、確認済みの状態になって初めて断言（as）できる構造にしている
 * そうすることで呼び出し側が扱いやすく、また型チェックの無効化を防ぐことができる
 *
 * - 却下案: 戻り値を object にする
 * → object 型はインデックスシグネチャを持たないため、 呼び出し側でmap['key']のような
 * 任意キーアクセスができず使いにくい
 *
 * - 却下案：戻り値を Record<stirng, any> にする
 * → any にすると呼び出し側が型チェックを無効化できてしまう
 * unknown にすることで呼び出し側に「中身を使う前に型を絞り込む責任」を持たせる
 *
 * @param raw - パースしたい要素
 * @returns パース済みマップ、不正時は null
 */
export function parseGoodsImageVariationsJson(
  raw: string | null | undefined,
): Record<string, unknown> | null {
  if (raw == null || raw === "") return null;
  try {
    const map = JSON.parse(raw) as unknown;
    if (!map || typeof map !== "object" || Array.isArray(map)) return null;
    return map as Record<string, unknown>;
  } catch {
    return null;
  }
}
