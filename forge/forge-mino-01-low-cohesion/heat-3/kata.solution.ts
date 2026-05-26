// [heat-3] 解答(閲覧・比較用)

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
    // 防衛コピー: 外部の配列が後から変更されても内部状態に影響しない
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

  toSnapshot(): readonly OrderItem[] {
    // readonly 型として返すことで、TypeScript レベルでの変更を防ぐ
    // ランタイムでの保護を強めたい場合は [...this.items] を返す選択もある
    return this.items;
  }
}
