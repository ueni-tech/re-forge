import { describe, it, expect, vi } from "vitest";
import { createVariationNavigateCoordinator } from "./kata";

describe("[heat-3] createVariationNavigateCoordinator", () => {
  it("ギャラリーを先に、カートを後に呼ぶ", () => {
    const order: string[] = [];
    const applyGallery = vi.fn((c: string) => order.push(`g:${c}`));
    const applyCart = vi.fn((c: string) => order.push(`c:${c}`));
    const navigate = createVariationNavigateCoordinator({
      applyGallery,
      applyCart,
    });
    navigate("LC-1");
    expect(order).toEqual(["g:LC-1", "c:LC-1"]);
  });

  it("空の listingCode ではどちらも呼ばない", () => {
    const applyGallery = vi.fn();
    const applyCart = vi.fn();
    const navigate = createVariationNavigateCoordinator({
      applyGallery,
      applyCart,
    });
    navigate("");
    expect(applyGallery).not.toHaveBeenCalled();
    expect(applyCart).not.toHaveBeenCalled();
  });

  it("片方だけでも動作し、指定されていない方は呼ばれない", () => {
    const applyCart = vi.fn();
    const navigate = createVariationNavigateCoordinator({ applyCart });
    navigate("X");
    expect(applyCart).toHaveBeenCalledTimes(1);
    expect(applyCart).toHaveBeenCalledWith("X");
  });

  it("両方省略でも例外にならない", () => {
    const navigate = createVariationNavigateCoordinator({});
    expect(() => navigate("ok")).not.toThrow();
  });
});
