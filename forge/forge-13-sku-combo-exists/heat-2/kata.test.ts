import { describe, it, expect } from "vitest";
import { hasLinesForStateColorDiameter, VariationSku } from "./kata";

const SKUS: VariationSku[] = [
  { code: "A", label: "赤", ballDiameter: "0.7", engravingLines: "1", saleStatus: 3 },
  { code: "B", label: "赤", ballDiameter: "0.7", engravingLines: "2", saleStatus: 1 },
  { code: "C", label: "赤", ballDiameter: "1.0", engravingLines: "1", saleStatus: 3 },
];

describe("[heat-2] hasLinesForStateColorDiameter", () => {
  it("色×径×行数が存在すれば true", () => {
    expect(
      hasLinesForStateColorDiameter(
        { label: "赤", ballDiameter: "0.7" },
        SKUS,
        "2",
      ),
    ).toBe(true);
  });

  it("行数が違えば false", () => {
    expect(
      hasLinesForStateColorDiameter(
        { label: "赤", ballDiameter: "0.7" },
        SKUS,
        "3",
      ),
    ).toBe(false);
  });

  it("state に径が無いときは径で絞らない", () => {
    expect(
      hasLinesForStateColorDiameter({ label: "赤" }, SKUS, "1"),
    ).toBe(true);
  });

  it("径が state と一致しない行だけでは true にならない", () => {
    expect(
      hasLinesForStateColorDiameter(
        { label: "赤", ballDiameter: "0.7" },
        SKUS,
        "1",
      ),
    ).toBe(true);
    expect(
      hasLinesForStateColorDiameter(
        { label: "赤", ballDiameter: "1.0" },
        SKUS,
        "2",
      ),
    ).toBe(false);
  });
});
