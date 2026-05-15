export type CollectableElement = {
  type: string;
  checked: boolean;
  value: string;
  dataset: { basketParam?: string; basketValue?: string };
};

export function collectPayload(elements: CollectableElement[]): Record<string, string> {
  const payload: Record<string, string> = {};
  elements.forEach((el) => {
    if (el.type === "radio" || el.type === "checkbox") {
      if (!el.checked) return;
    }
    const key = el.dataset.basketParam;
    if (!key) return;
    const value =
      el.dataset.basketValue !== undefined && el.dataset.basketValue !== ""
        ? el.dataset.basketValue
        : el.value;
    payload[key] = value;
  });
  return payload;
}
