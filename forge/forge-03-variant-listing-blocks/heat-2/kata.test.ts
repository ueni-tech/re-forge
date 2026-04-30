import { describe, it, expect } from "vitest";
import { firstListingCodeOnPath } from "./kata";

describe("[heat-2] firstListingCodeOnPath", () => {
  it("先頭ノードに listing code があるときはそれを返す", () => {
    const path = [{ listingCode: "ST-TKV-A2" }, { listingCode: null }];
    expect(firstListingCodeOnPath(path)).toBe("ST-TKV-A2");
  });

  it("内側は null で親に listing code があるときは親の値を返す", () => {
    const path = [{ listingCode: null }, { listingCode: "ST-TKV-A1" }];
    expect(firstListingCodeOnPath(path)).toBe("ST-TKV-A1");
  });

  it("空文字はスキップして次を見る", () => {
    const path = [{ listingCode: "" }, { listingCode: "X" }];
    expect(firstListingCodeOnPath(path)).toBe("X");
  });

  it("該当が無いときは null", () => {
    expect(firstListingCodeOnPath([{ listingCode: null }, { listingCode: undefined }])).toBeNull();
    expect(firstListingCodeOnPath([])).toBeNull();
  });
});
