// [refactor/heat-3] solution: 抽出された OrderItems ファーストクラスコレクション

export type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

const HIGH_PRICE_THRESHOLD = 5000;

export class OrderItems {
  static readonly MAX_ITEMS = 10;
  private readonly items: readonly OrderItem[];

  constructor(items: OrderItem[] = []) {
    if (items.length > OrderItems.MAX_ITEMS) {
      throw new Error(
        `items length (${items.length}) exceeds max (${OrderItems.MAX_ITEMS})`,
      );
    }
    this.items = [...items];
  }

  add(item: OrderItem): OrderItems {
    if (this.items.length >= OrderItems.MAX_ITEMS) {
      throw new Error(
        `cannot add: already at max (${OrderItems.MAX_ITEMS})`,
      );
    }
    return new OrderItems([...this.items, item]);
  }

  totalAmount(): number {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }

  count(): number {
    return this.items.length;
  }

  hasHighPriceItem(): boolean {
    return this.items.some((item) => item.price >= HIGH_PRICE_THRESHOLD);
  }

  highPriceItemNames(): string[] {
    return this.items
      .filter((item) => item.price >= HIGH_PRICE_THRESHOLD)
      .map((item) => item.name);
  }

  remainingCapacity(): number {
    return OrderItems.MAX_ITEMS - this.items.length;
  }

  toSnapshot(): readonly OrderItem[] {
    return this.items;
  }
}
