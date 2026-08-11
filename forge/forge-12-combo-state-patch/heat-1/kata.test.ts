import { describe, it, expect } from "vitest";
import { stateFromSku } from "./kata";

describe("[heat-1] stateFromSku", () => {
  it("全軸が揃った SKU から state を組み立てる", () => {
    const sku = {
      code: "PEN-001",
      label: "赤",
      ballDiameter: "0.7",
      engravingLines: "2",
      wrapping: "箱",
      saleStatus: 3,
    };
    expect(stateFromSku(sku)).toEqual({
      label: "赤",
      ballDiameter: "0.7",
      engravingLines: "2",
    });
  });

  it("径・行数が無い SKU では label のみ", () => {
    const sku = {
      code: "PEN-002",
      label: "青",
      saleStatus: 1,
    };
    expect(stateFromSku(sku)).toEqual({ label: "青" });
  });

  it("空文字の軸は state に含めない", () => {
    const sku = {
      code: "PEN-003",
      label: "黒",
      ballDiameter: "",
      engravingLines: "",
      saleStatus: 1,
    };
    expect(stateFromSku(sku)).toEqual({ label: "黒" });
  });

  it("wrapping は state にコピーしない", () => {
    const sku = {
      code: "PEN-004",
      label: "緑",
      wrapping: "袋",
      saleStatus: 3,
    };
    const state = stateFromSku(sku);
    expect(state).toEqual({ label: "緑" });
    expect("wrapping" in state).toBe(false);
  });
});
