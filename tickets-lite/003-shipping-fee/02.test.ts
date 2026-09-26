// [003/02] 判定 — 追加分。01.test.ts も緑のままであること。

import { describe, it, expect } from "vitest";
import { calculateShippingFee } from "./solution";

type MemberRank = "regular" | "gold";
type ShippingOrder = {
  subtotal: number;
  region: string;
  isRemoteIsland: boolean;
  requiresCool: boolean;
  memberRank?: MemberRank;
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
  options: { isRemoteIsland?: boolean; requiresCool?: boolean; memberRank?: MemberRank } = {},
): Readonly<ShippingOrder> {
  const o: ShippingOrder = {
    subtotal,
    region,
    isRemoteIsland: options.isRemoteIsland ?? false,
    requiresCool: options.requiresCool ?? false,
  };
  if (options.memberRank !== undefined) o.memberRank = options.memberRank;
  return Object.freeze(o);
}

const run = (o: Readonly<ShippingOrder>) =>
  calculateShippingFee(o as ShippingOrder, policy as ShippingPolicy);

describe("[003/02] 会員ランクによる送料無料", () => {
  it("ゴールド会員はしきい値未満でも基本料が免除され、あと○円は 0", () => {
    expect(run(order(3000, "kanto", { memberRank: "gold" }))).toEqual({
      status: "ok",
      fee: 0,
      remainingForFree: 0,
    });
  });

  it("ゴールド会員でも離島・クール便の加算は残る", () => {
    expect(
      run(order(3000, "kanto", { isRemoteIsland: true, requiresCool: true, memberRank: "gold" })),
    ).toEqual({ status: "ok", fee: 800, remainingForFree: 0 });
  });

  it("通常会員は 01 と同じ", () => {
    expect(run(order(3000, "kanto", { memberRank: "regular" }))).toEqual({
      status: "ok",
      fee: 600,
      remainingForFree: 2000,
    });
  });

  it("memberRank 未設定は通常会員と同じ", () => {
    expect(run(order(3000, "kanto"))).toEqual({ status: "ok", fee: 600, remainingForFree: 2000 });
  });

  it("しきい値以上のゴールド会員も fee 0 のまま（二重に引かない）", () => {
    expect(run(order(8000, "kanto", { memberRank: "gold" }))).toEqual({
      status: "ok",
      fee: 0,
      remainingForFree: 0,
    });
  });

  it("ゴールド会員でもテーブルに無い地域は invalid", () => {
    expect(run(order(3000, "tohoku", { memberRank: "gold" }))).toEqual({ status: "invalid" });
  });

  it("ゴールド会員でも合計が負なら invalid", () => {
    expect(run(order(-1, "kanto", { memberRank: "gold" }))).toEqual({ status: "invalid" });
  });
});
