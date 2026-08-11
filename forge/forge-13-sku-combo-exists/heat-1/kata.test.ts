import { describe, it, expect } from "vitest";
import { hasDiameterForStateColor, VariationSku } from "./kata";

const SKUS: VariationSku[] = [
  { code: "A", label: "赤", ballDiameter: "0.7", saleStatus: 3 },
  { code: "B", label: "赤", ballDiameter: "1.0", saleStatus: 1 },
  { code: "C", label: "青", ballDiameter: "0.7", saleStatus: 3 },
];

describe("[heat-1] hasDiameterForStateColor", () => {
  it("色×径が存在すれば true", () => {
    expect(hasDiameterForStateColor({ label: "赤" }, SKUS, "0.7")).toBe(true);
  });

  it("色は合うが径が無ければ false", () => {
    expect(hasDiameterForStateColor({ label: "赤" }, SKUS, "0.5")).toBe(false);
  });

  it("径は合うが色が違えば false", () => {
    expect(hasDiameterForStateColor({ label: "緑" }, SKUS, "0.7")).toBe(false);
  });

  it("空配列は false", () => {
    expect(hasDiameterForStateColor({ label: "赤" }, [], "0.7")).toBe(false);
  });
});
