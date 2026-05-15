export type PrefillData = Record<string, Record<string, string>>;
export type ElementWithName = { name?: string };

export function parsePrefillData(raw: string | null | undefined): PrefillData | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as PrefillData;
  } catch (err) {
    console.warn(err);
    return undefined;
  }
}

export function getPrefillValue(
  el: ElementWithName | null | undefined,
  prefillData: PrefillData,
): string | undefined {
  if (!el) return undefined;
  const elementName = el.name;
  if (!elementName) return undefined;
  const match = elementName.match(
    /^param\[([^\]]+)\]\[[^\]]*\]\[[^\]]*\]\[([^\]]+)\]$/,
  );
  if (!match) return undefined;
  const listingCode = match[1];
  const templateName = match[2];
  if (!prefillData[listingCode] || !prefillData[listingCode][templateName])
    return undefined;
  return prefillData[listingCode][templateName];
}
