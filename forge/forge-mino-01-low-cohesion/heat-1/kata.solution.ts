// [heat-1] 解答(閲覧・比較用)

export class Price {
  private readonly amount: number;

  constructor(amount: number) {
    if (amount < 0) {
      throw new Error(`Price must be non-negative: ${amount}`);
    }
    if (!Number.isFinite(amount)) {
      throw new Error(`Price must be finite: ${amount}`);
    }
    this.amount = amount;
  }

  withTax(rate: number): Price {
    if (rate < 0) {
      throw new Error(`tax rate must be non-negative: ${rate}`);
    }
    return new Price(Math.floor(this.amount * (1 + rate)));
  }

  discount(rate: number): Price {
    if (rate < 0 || rate > 1) {
      throw new Error(`discount rate must be in [0, 1]: ${rate}`);
    }
    return new Price(Math.floor(this.amount * (1 - rate)));
  }

  toDisplay(): string {
    return `¥${this.amount.toLocaleString("ja-JP")}`;
  }

  toNumber(): number {
    return this.amount;
  }
}
