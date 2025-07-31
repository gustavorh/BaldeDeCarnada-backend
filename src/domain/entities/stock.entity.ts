export class Stock {
  constructor(
    public readonly productId: number,
    public readonly currentQuantity: number,
    public readonly updatedAt: Date,
  ) {}

  static create(props: {
    productId: number;
    currentQuantity: number;
    updatedAt: Date;
  }): Stock {
    return new Stock(
      props.productId,
      props.currentQuantity,
      props.updatedAt,
    );
  }

  toJSON() {
    return {
      productId: this.productId,
      currentQuantity: this.currentQuantity,
      updatedAt: this.updatedAt,
    };
  }

  isAvailable(): boolean {
    return this.currentQuantity > 0;
  }

  canFulfillOrder(requestedQuantity: number): boolean {
    return this.currentQuantity >= requestedQuantity;
  }
}
