// [refactor/heat-2] solution: 抽出された Stock クラス

export class Stock {
  private readonly quantity: number;
  private readonly limit: number;

  constructor(quantity: number, limit: number) {
    if (quantity < 0) {
      throw new Error(`quantity must be non-negative: ${quantity}`);
    }
    if (limit < 0) {
      throw new Error(`limit must be non-negative: ${limit}`);
    }
    if (quantity > limit) {
      throw new Error(
        `quantity (${quantity}) must not exceed limit (${limit})`,
      );
    }
    this.quantity = quantity;
    this.limit = limit;
  }

  add(amount: number): Stock {
    if (amount < 0) {
      throw new Error(`amount must be non-negative: ${amount}`);
    }
    if (!this.canAdd(amount)) {
      throw new Error(
        `cannot add ${amount}: would exceed limit ${this.limit}`,
      );
    }
    return new Stock(this.quantity + amount, this.limit);
  }

  reserve(amount: number): Stock {
    if (amount < 0) {
      throw new Error(`amount must be non-negative: ${amount}`);
    }
    if (!this.canReserve(amount)) {
      throw new Error(
        `cannot reserve ${amount}: only ${this.quantity} available`,
      );
    }
    return new Stock(this.quantity - amount, this.limit);
  }

  canAdd(amount: number): boolean {
    return amount >= 0 && this.quantity + amount <= this.limit;
  }

  canReserve(amount: number): boolean {
    return amount >= 0 && this.quantity - amount >= 0;
  }

  isEmpty(): boolean {
    return this.quantity === 0;
  }

  isFull(): boolean {
    return this.quantity >= this.limit;
  }

  remainingCapacity(): number {
    return this.limit - this.quantity;
  }

  toQuantity(): number {
    return this.quantity;
  }

  toLimit(): number {
    return this.limit;
  }
}
