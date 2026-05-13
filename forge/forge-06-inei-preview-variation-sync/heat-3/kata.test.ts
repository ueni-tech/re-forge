import { describe, it, expect, vi } from "vitest";
import {
  firstImageUrl,
  createVariationSyncController,
  type ImageData,
  type ControllerDeps,
} from "./kata";

describe("[heat-3] firstImageUrl", () => {
  it("images が null / undefined のとき '' を返す", () => {
    expect(firstImageUrl(null)).toBe("");
    expect(firstImageUrl(undefined)).toBe("");
  });

  it("list が空のとき '' を返す", () => {
    expect(firstImageUrl({ base: "https://cdn/x", list: [] })).toBe("");
  });

  it("main を優先して URL を組み立てる", () => {
    const images: ImageData = {
      base: "https://cdn/x",
      list: [{ main: "1.jpg", thumb: "1_t.jpg" }],
    };
    expect(firstImageUrl(images)).toBe("https://cdn/x/1.jpg");
  });

  it("main がなければ thumb を使う", () => {
    const images: ImageData = {
      base: "https://cdn/x",
      list: [{ thumb: "1_t.jpg" }],
    };
    expect(firstImageUrl(images)).toBe("https://cdn/x/1_t.jpg");
  });

  it("main も thumb もなければ '' を返す", () => {
    const images: ImageData = {
      base: "https://cdn/x",
      list: [{}],
    };
    expect(firstImageUrl(images)).toBe("");
  });
});

describe("[heat-3] createVariationSyncController", () => {
  function makeDeps(overrides?: Partial<ControllerDeps>): ControllerDeps {
    return {
      readState: vi.fn(() => ({ color: "赤", font: "ゴシック体", layout: "横" })),
      writeLabels: vi.fn(),
      getThumbEl: vi.fn(() => null),
      schedule: vi.fn((fn: () => void) => fn()),
      ...overrides,
    };
  }

  it("sync() は readState の結果を writeLabels に渡す", () => {
    const deps = makeDeps();
    const controller = createVariationSyncController(deps);
    controller.sync();
    expect(deps.readState).toHaveBeenCalledOnce();
    expect(deps.writeLabels).toHaveBeenCalledWith({
      color: "赤",
      font: "ゴシック体",
      layout: "横",
    });
  });

  it("syncSoon() は schedule 経由で sync を呼ぶ", () => {
    const deps = makeDeps();
    const controller = createVariationSyncController(deps);
    controller.syncSoon();
    expect(deps.schedule).toHaveBeenCalledOnce();
    expect(deps.writeLabels).toHaveBeenCalled();
  });

  it("onPickerClick: [data-listing-code] の祖先がある場合だけ syncSoon を呼ぶ", () => {
    const deps = makeDeps();
    const controller = createVariationSyncController(deps);

    const targetWithCode = { closest: vi.fn((_s: string) => ({ tagName: "BUTTON" })) };
    const targetWithout = { closest: vi.fn((_s: string) => null) };

    controller.onPickerClick(targetWithCode);
    expect(deps.schedule).toHaveBeenCalledOnce();

    controller.onPickerClick(targetWithout);
    // 2 回目は呼ばれない
    expect(deps.schedule).toHaveBeenCalledOnce();
  });

  it("onImageListUpdated: URL が取れて IMG なら src を差し替える", () => {
    const thumb = { tagName: "IMG", src: "" };
    const deps = makeDeps({ getThumbEl: vi.fn(() => thumb) });
    const controller = createVariationSyncController(deps);

    const images: ImageData = {
      base: "https://cdn/x",
      list: [{ main: "1.jpg" }],
    };
    controller.onImageListUpdated({ images });
    expect(thumb.src).toBe("https://cdn/x/1.jpg");
  });

  it("onImageListUpdated: URL が '' のとき src を変更しない", () => {
    const thumb = { tagName: "IMG", src: "original.jpg" };
    const deps = makeDeps({ getThumbEl: vi.fn(() => thumb) });
    const controller = createVariationSyncController(deps);

    controller.onImageListUpdated({ images: { base: "https://cdn", list: [] } });
    expect(thumb.src).toBe("original.jpg");
  });
});
