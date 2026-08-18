const CARVING_BLOCK_SELECTOR =
  ".js-carving-font-block, .js-carving-text1-block, .js-carving-text2-block";

export function syncCarvingBlocks(listingCode: string): void {
  document.querySelectorAll<HTMLElement>(CARVING_BLOCK_SELECTOR).forEach((block) => {
    const codes = (block.getAttribute("data-listing-codes") || "")
      .split(/\s+/)
      .filter(Boolean);
    const active = codes.includes(listingCode);
    block.hidden = !active;

    const fieldset = block.querySelector("fieldset");
    if (fieldset instanceof HTMLFieldSetElement) {
      fieldset.disabled = !active;
    }
  });
}
