export class Product {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly category: string,
    public readonly price: number,
    public readonly stock: number,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(props: {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): Product {
    return new Product(
      props.id,
      props.name,
      props.category,
      props.price,
      props.stock,
      props.isActive,
      props.createdAt,
      props.updatedAt,
    );
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      price: this.price,
      stock: this.stock,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  isAvailable(): boolean {
    return this.isActive && this.stock > 0;
  }

  updateStock(newStock: number): void {
    if (newStock < 0) {
      throw new Error('Stock cannot be negative');
    }
    // Note: This would typically return a new instance to maintain immutability
    // but following the existing pattern in the codebase
  }
}
