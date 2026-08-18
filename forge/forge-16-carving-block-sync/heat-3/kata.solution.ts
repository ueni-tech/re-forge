const CARVING_ROOT_SELECTOR = "#order-option-carving";
const CARVING_BLOCK_SELECTOR =
  ".js-carving-font-block, .js-carving-text1-block, .js-carving-text2-block";
const CARVING_FONT_BLOCK_SELECTOR = ".js-carving-font-block";
const CARVING_TEXT1_BLOCK_SELECTOR = ".js-carving-text1-block";
const CARVING_TEXT2_BLOCK_SELECTOR = ".js-carving-text2-block";
const CARVING_FONT_INPUT_SELECTOR = ".js-carving-font-input";
const CARVING_FONT_LABEL_SELECTOR = ".js-carving-font-label";
const TEXT_INPUT_SELECTOR = "input[data-basket-param]";

const engravingDraft = {
  carvingFontValue: "",
  textLine1: "",
  textLine2: "",
};

function getCarvingRoot(): HTMLElement | null {
  return document.querySelector(CARVING_ROOT_SELECTOR);
}

function getVisibleBlock(selector: string): HTMLElement | null {
  const root = getCarvingRoot();
  if (!root) return null;
  let visible: HTMLElement | null = null;
  root.querySelectorAll<HTMLElement>(selector).forEach((block) => {
    if (!block.hidden && !visible) visible = block;
  });
  return visible;
}

function readCarvingFontValue(block: HTMLElement): string {
  const checked = block.querySelector<HTMLInputElement>(
    `${CARVING_FONT_INPUT_SELECTOR}:checked`,
  );
  return checked ? checked.value : "";
}

function readTextValue(block: HTMLElement): string {
  const input = block.querySelector<HTMLInputElement>(TEXT_INPUT_SELECTOR);
  return input ? input.value : "";
}

function syncCarvingBlocks(listingCode: string): void {
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

function captureDraftFromVisibleBlocks(): void {
  const fontBlock = getVisibleBlock(CARVING_FONT_BLOCK_SELECTOR);
  const text1Block = getVisibleBlock(CARVING_TEXT1_BLOCK_SELECTOR);
  const text2Block = getVisibleBlock(CARVING_TEXT2_BLOCK_SELECTOR);

  if (fontBlock) engravingDraft.carvingFontValue = readCarvingFontValue(fontBlock);
  if (text1Block) engravingDraft.textLine1 = readTextValue(text1Block);
  if (text2Block) engravingDraft.textLine2 = readTextValue(text2Block);
}

function syncCarvingFontChecked(): void {
  const root = getCarvingRoot();
  if (!root) return;

  root.querySelectorAll<HTMLInputElement>(CARVING_FONT_INPUT_SELECTOR).forEach((input) => {
    input.checked = false;
  });

  const fontBlock = getVisibleBlock(CARVING_FONT_BLOCK_SELECTOR);
  if (!fontBlock) return;

  const inputs = fontBlock.querySelectorAll<HTMLInputElement>(CARVING_FONT_INPUT_SELECTOR);
  if (!inputs.length) return;

  let matched: HTMLInputElement | null = null;
  inputs.forEach((input) => {
    if (input.value === engravingDraft.carvingFontValue) matched = input;
  });
  (matched || inputs[0]).checked = true;
}

function applyDraftToVisibleBlocks(): void {
  const text1Block = getVisibleBlock(CARVING_TEXT1_BLOCK_SELECTOR);
  const text2Block = getVisibleBlock(CARVING_TEXT2_BLOCK_SELECTOR);

  if (text1Block) {
    const input = text1Block.querySelector<HTMLInputElement>(TEXT_INPUT_SELECTOR);
    if (input) input.value = engravingDraft.textLine1;
  }
  if (text2Block) {
    const input = text2Block.querySelector<HTMLInputElement>(TEXT_INPUT_SELECTOR);
    if (input) input.value = engravingDraft.textLine2;
  }
}

export function syncCarvingFontLabel(): void {
  const fontBlock = getVisibleBlock(CARVING_FONT_BLOCK_SELECTOR);
  if (!fontBlock) return;

  const text = readCarvingFontValue(fontBlock);
  document.querySelectorAll<HTMLElement>(CARVING_FONT_LABEL_SELECTOR).forEach((label) => {
    label.textContent = text;
  });
}

export function applyCarvingSyncForListingCode(listingCode: string): void {
  captureDraftFromVisibleBlocks();
  syncCarvingBlocks(listingCode);
  syncCarvingFontChecked();
  applyDraftToVisibleBlocks();
  syncCarvingFontLabel();
}
