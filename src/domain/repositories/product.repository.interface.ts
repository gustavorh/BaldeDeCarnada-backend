import { Product } from '../entities/product.entity';

export interface ProductRepositoryInterface {
  findAll(): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  findByCategory(category: string): Promise<Product[]>;
  findByName(name: string): Promise<Product[]>;
  findActiveProducts(): Promise<Product[]>;
  findAvailableProducts(): Promise<Product[]>; // Products with stock > 0
  create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
  update(id: number, product: Partial<Product>): Promise<Product | null>;
  updateStock(id: number, newStock: number): Promise<Product | null>;
  delete(id: number): Promise<boolean>;
  deactivate(id: number): Promise<Product | null>; // Soft delete
}
