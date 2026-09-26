// [003/01] 判定

import { describe, it, expect } from "vitest";
import { calculateShippingFee } from "./solution";

type ShippingOrder = {
  subtotal: number;
  region: string;
  isRemoteIsland: boolean;
  requiresCool: boolean;
};
type ShippingPolicy = {
  baseFeeByRegion: Record<string, number>;
  freeShippingThreshold: number;
  remoteIslandSurcharge: number;
  coolSurcharge: number;
};

const policy: Readonly<ShippingPolicy> = Object.freeze({
  baseFeeByRegion: Object.freeze({ kanto: 600, hokkaido: 1200, okinawa: 1500 }),
  freeShippingThreshold: 5000,
  remoteIslandSurcharge: 500,
  coolSurcharge: 300,
});

function order(
  subtotal: number,
  region: string,
  options: { isRemoteIsland?: boolean; requiresCool?: boolean } = {},
): Readonly<ShippingOrder> {
  return Object.freeze({
    subtotal,
    region,
    isRemoteIsland: options.isRemoteIsland ?? false,
    requiresCool: options.requiresCool ?? false,
  });
}

const run = (o: Readonly<ShippingOrder>, p: Readonly<ShippingPolicy> = policy) =>
  calculateShippingFee(o as ShippingOrder, p as ShippingPolicy);

describe("[003/01] 送料の決定", () => {
  it("しきい値未満は地域の基本料。あと○円はしきい値との差", () => {
    expect(run(order(3000, "kanto"))).toEqual({ status: "ok", fee: 600, remainingForFree: 2000 });
  });

  it("ちょうどしきい値で基本料は免除される", () => {
    expect(run(order(5000, "kanto"))).toEqual({ status: "ok", fee: 0, remainingForFree: 0 });
  });

  it("免除されても離島・クール便の加算は残る", () => {
    expect(run(order(8000, "kanto", { isRemoteIsland: true, requiresCool: true }))).toEqual({
      status: "ok",
      fee: 800,
      remainingForFree: 0,
    });
  });

  it("地域ごとの基本料にクール便加算を足す", () => {
    expect(run(order(3000, "hokkaido", { requiresCool: true }))).toEqual({
      status: "ok",
      fee: 1500,
      remainingForFree: 2000,
    });
  });

  it("離島加算のみ。しきい値に 1 円足りない", () => {
    expect(run(order(4999, "okinawa", { isRemoteIsland: true }))).toEqual({
      status: "ok",
      fee: 2000,
      remainingForFree: 1,
    });
  });

  it("合計 0 は有効。あと○円はしきい値そのもの", () => {
    expect(run(order(0, "kanto"))).toEqual({ status: "ok", fee: 600, remainingForFree: 5000 });
  });

  it("テーブルに無い地域は invalid", () => {
    expect(run(order(3000, "tohoku"))).toEqual({ status: "invalid" });
  });

  it("合計が負なら invalid", () => {
    expect(run(order(-1, "kanto"))).toEqual({ status: "invalid" });
  });

  it("地域が無く合計も負でも例外を投げない", () => {
    expect(() => run(order(-1, "tohoku"))).not.toThrow();
    expect(run(order(-1, "tohoku"))).toEqual({ status: "invalid" });
  });

  it("policy の値が違えば結果も変わる（定数を埋め込んでいない）", () => {
    const other: Readonly<ShippingPolicy> = Object.freeze({
      baseFeeByRegion: Object.freeze({ kanto: 800 }),
      freeShippingThreshold: 10000,
      remoteIslandSurcharge: 1000,
      coolSurcharge: 200,
    });
    expect(run(order(3000, "kanto", { isRemoteIsland: true, requiresCool: true }), other)).toEqual({
      status: "ok",
      fee: 2000,
      remainingForFree: 7000,
    });
  });
});
