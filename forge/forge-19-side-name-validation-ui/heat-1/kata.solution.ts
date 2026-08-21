import {
  resolveRuleSet,
  validateSideName,
  validationRuleFieldSelector,
  resolveMaxLengthByScript,
} from "../fixtures/validation-ref";
import type { CreateSideNameValidationOptions, ValidationResult } from "../fixtures/types";

type MaxLengthByScript = { ja: number; en: number };

export type { CreateSideNameValidationOptions };

export function createSideNameValidation(options: CreateSideNameValidationOptions): {
  init: () => void;
  syncValidationState: () => void;
} {
  const lastValidationResults = new Map<HTMLInputElement, boolean>();
  let historyRestoreBound = false;

  function renderMessage(inputEl: HTMLInputElement, validatedResult: ValidationResult): void {
    const messageEl = inputEl.closest(".js-validation-field")?.querySelector(".js-validation-message");
    if (!messageEl) {
      console.error("Missing messageEl: renderMessage");
      return;
    }
    messageEl.textContent = validatedResult.ok ? "" : validatedResult.message;
  }

  function notifyResultsChange(): void {
    if (!options.onResultsChange) return;
    const allOk = [...lastValidationResults.values()].every((ok) => ok === true);
    options.onResultsChange(allOk);
  }

  function runValidation(inputEl: HTMLInputElement): void {
    if (options.isActiveInput && !options.isActiveInput(inputEl)) return;
    const ruleSet = resolveRuleSet(inputEl.dataset.validationRule);
    if (!ruleSet) {
      console.error("Missing ruleSet");
      lastValidationResults.set(inputEl, false);
      notifyResultsChange();
      return;
    }

    const validationInput = options.buildInput(inputEl);
    if (!validationInput) {
      lastValidationResults.set(inputEl, false);
      notifyResultsChange();
      return;
    }

    const validationResult = validateSideName(validationInput, ruleSet);
    renderMessage(inputEl, validationResult);
    lastValidationResults.set(inputEl, validationResult.ok);
    notifyResultsChange();
  }

  function debounceFactory(fn: () => void, ms: number): () => void {
    let timerId: ReturnType<typeof setTimeout> | undefined;
    return () => {
      clearTimeout(timerId);
      timerId = setTimeout(fn, ms);
    };
  }

  function bindInputEvent(inputEl: HTMLInputElement): void {
    let isComposing = false;
    const debounceRunValidation = debounceFactory(() => runValidation(inputEl), 300);

    inputEl.addEventListener("compositionstart", () => {
      isComposing = true;
    });
    inputEl.addEventListener("compositionend", () => {
      isComposing = false;
      runValidation(inputEl);
    });
    inputEl.addEventListener("input", () => {
      if (isComposing) return;
      debounceRunValidation();
    });
  }

  function formatMaxLengthDisplayLabel(max: MaxLengthByScript): string {
    if (max.ja === 0) {
      return `英数字のみ:${max.en}文字まで`;
    }
    return `英数字のみ:${max.en}文字まで/日本語含む:${max.ja}文字まで`;
  }

  function updateMaxLengthDisplay(inputEl: HTMLInputElement): void {
    const validationInput = options.buildInput(inputEl);
    if (!validationInput) return;
    const displayEl = options.findMaxLengthDisplayEl(inputEl);
    if (!displayEl) {
      console.warn("Missing max length display Element");
      return;
    }
    const max = resolveMaxLengthByScript(validationInput.code, validationInput.font);
    displayEl.textContent = formatMaxLengthDisplayLabel(max);
  }

  function bindFontChangeEvents(inputEl: HTMLInputElement): void {
    const fontRadios = options.findFontRadios(inputEl);
    fontRadios?.forEach((radio) => {
      radio.addEventListener("change", () => {
        runValidation(inputEl);
        updateMaxLengthDisplay(inputEl);
      });
    });
  }

  function revalidateAfterHistoryRestore(): void {
    for (const inputEl of lastValidationResults.keys()) {
      runValidation(inputEl);
      updateMaxLengthDisplay(inputEl);
    }
  }

  function bindHistoryRestoreRevalidation(): void {
    if (historyRestoreBound) return;
    historyRestoreBound = true;
    window.addEventListener("pageshow", () => {
      window.setTimeout(revalidateAfterHistoryRestore, 0);
    });
  }

  function clearMessage(inputEl: HTMLInputElement): void {
    renderMessage(inputEl, { ok: true });
  }

  function syncValidationState(): void {
    const inputFields = document.querySelectorAll<HTMLInputElement>(validationRuleFieldSelector());
    inputFields.forEach((inputEl) => {
      const active = !options.isActiveInput || options.isActiveInput(inputEl);
      if (!active) {
        lastValidationResults.delete(inputEl);
        clearMessage(inputEl);
        return;
      }
      if (!lastValidationResults.has(inputEl)) {
        lastValidationResults.set(inputEl, false);
      }
      runValidation(inputEl);
      updateMaxLengthDisplay(inputEl);
    });
    notifyResultsChange();
  }

  function init(): void {
    const inputFields = document.querySelectorAll<HTMLInputElement>(validationRuleFieldSelector());
    if (!inputFields.length) return;
    inputFields.forEach((inputEl) => {
      if (!options.hasFont(inputEl)) {
        console.warn("side_name_validation: 書体選択がないためスキップ");
        return;
      }
      lastValidationResults.set(inputEl, false);
      const isActive = !options.isActiveInput || options.isActiveInput(inputEl);
      if (isActive) {
        runValidation(inputEl);
      }
      bindInputEvent(inputEl);
      bindFontChangeEvents(inputEl);
      if (isActive) {
        updateMaxLengthDisplay(inputEl);
      }
    });
    bindHistoryRestoreRevalidation();
  }

  return { init, syncValidationState };
}
