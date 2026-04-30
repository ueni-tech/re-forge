import { describe, it, expect, vi } from "vitest";
import { createVariationSelectionSession, type BlockRow } from "./kata";

function makeBlocks(codes: string[], initialHidden: boolean[]): BlockRow[] {
  return codes.map((listingCode, i) => ({
    listingCode,
    hidden: initialHidden[i]!,
  }));
}

describe("[heat-3] createVariationSelectionSession", () => {
  it("一致する listing code が無いときは何もしない", () => {
    const blocks = makeBlocks(["A", "B"], [false, true]);
    const notify = vi.fn();
    const { select } = createVariationSelectionSession(blocks, notify);
    select("Z");
    expect(notify).not.toHaveBeenCalled();
    expect(blocks.map((b) => b.hidden)).toEqual([false, true]);
  });

  it("select で hidden が更新され notify が1回呼ばれる", () => {
    const blocks = makeBlocks(["A", "B", "C"], [false, true, true]);
    const notify = vi.fn();
    const { select } = createVariationSelectionSession(blocks, notify);
    select("B");
    expect(blocks.map((b) => b.hidden)).toEqual([true, false, true]);
    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith({ listingCode: "B" });
  });

  it("連続 select でも notify はその都度呼ばれる", () => {
    const blocks = makeBlocks(["X", "Y"], [false, true]);
    const notify = vi.fn();
    const { select } = createVariationSelectionSession(blocks, notify);
    select("Y");
    select("X");
    expect(notify).toHaveBeenCalledTimes(2);
    expect(notify.mock.calls[1]![0]).toEqual({ listingCode: "X" });
  });
});
