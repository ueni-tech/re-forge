// [heat-1] 画像一覧シグネチャ（image set signature）

// imageSetSignature(base, files) を実装せよ。

//

// 目的: Redux の image.base / image.list が差し替わったとき、

// 「前回と同じ画像セットか」を **文字列比較** で安く判定する（Grid / PageControl の考え方）。

//

// 仕様:

//   - base が null / undefined / 空文字、または files.length === 0 のとき、'' を返す。

//   - それ以外は `${base}|${body}` を返す。

//     body は各要素を `${main}:${thumb}` にし（欠けている側は空文字）、';' で連結。

//     main / thumb は `??` で nullish を空文字に落とす（実務 hankoya は TS3.6 で三項だったが、ここでは現代 TS でよい）。

//

// 行き詰まったら kata.solution.ts を参照（写経より仕様との対応を読むこと）。



export type FileRef = { main?: string; thumb?: string };



export function imageSetSignature(

  _base: string | null | undefined,

  _files: FileRef[],

): string {

  throw new Error("not implemented");

}


