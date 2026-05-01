// [heat-3] 解答（閲覧・比較用）

export function createVariationNavigateCoordinator(deps: {
  applyGallery?: (listingCode: string) => void;
  applyCart?: (listingCode: string) => void;
}): (listingCode: string) => void {
  return function navigate(listingCode: string): void {
    if (!listingCode) return;
    deps.applyGallery?.(listingCode);
    deps.applyCart?.(listingCode);
  };
}
