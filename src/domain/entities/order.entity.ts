export interface OrderProduct {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export class Order {
  constructor(
    public readonly id: number,
    public readonly products: OrderProduct[],
    public readonly orderDate: Date,
    public readonly status: string,
    public readonly total: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: {
    id: number;
    products: OrderProduct[];
    orderDate: Date;
    status: string;
    total: number;
    createdAt: Date;
    updatedAt: Date;
  }): Order {
    return new Order(
      props.id,
      props.products,
      props.orderDate,
      props.status,
      props.total,
      props.createdAt,
      props.updatedAt,
    );
  }

  toJSON() {
    return {
      id: this.id,
      products: this.products,
      orderDate: this.orderDate,
      status: this.status,
      total: this.total,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  isPending(): boolean {
    return this.status === 'pending';
  }

  isCompleted(): boolean {
    return this.status === 'completed';
  }

  isCancelled(): boolean {
    return this.status === 'cancelled';
  }

  getTotalItems(): number {
    return this.products.reduce((total, product) => total + product.quantity, 0);
  }

  validateTotal(): boolean {
    const calculatedTotal = this.products.reduce((total, product) => total + product.subtotal, 0);
    return Math.abs(calculatedTotal - this.total) < 0.01; // Allow for small floating point differences
  }
}
