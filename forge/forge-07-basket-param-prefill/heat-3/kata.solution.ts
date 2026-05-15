export type PrefillData = Record<string, Record<string, string>>;

export type PrefillableElement = {
  type: string;
  name: string;
  value: string;
  click: () => void;
};

export type PrefillableForm = {
  querySelectorAll: (selector: string) => PrefillableElement[];
};

export function getPrefillValue(
  el: { name?: string } | null | undefined,
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

export const applyStrategies: Record<
  string,
  (el: PrefillableElement, val: string) => void
> = {
  checked(el, val) {
    if (el.value === val) el.click();
  },
  default(el, val) {
    el.value = val;
  },
};

export function getStrategyKey(el: { type: string }): "checked" | "default" {
  return el.type === "radio" || el.type === "checkbox" ? "checked" : "default";
}

export function initForm(
  form: PrefillableForm | null | undefined,
  prefillData: PrefillData | undefined,
): void {
  if (!form) return;
  if (!prefillData) return;
  const elements = form.querySelectorAll('[name^="param["]');
  elements.forEach((el) => {
    const val = getPrefillValue(el, prefillData);
    if (!val) return;
    const strategy = applyStrategies[getStrategyKey(el)] ?? applyStrategies.default;
    strategy(el, val);
  });
}
