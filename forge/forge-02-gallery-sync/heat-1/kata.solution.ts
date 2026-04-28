// [heat-1] 模範解答 — 閲覧用。練習では kata.ts を編集すること。
export type FileRef = { main?: string; thumb?: string };

export function imageSetSignature(
  base: string | null | undefined,
  files: FileRef[],
): string {
  const b = base ?? "";
  if (b === "" || files.length === 0) {
    return "";
  }
  const body = files
    .map((f) => `${f.main ?? ""}:${f.thumb ?? ""}`)
    .join(";");
  return `${b}|${body}`;
}
