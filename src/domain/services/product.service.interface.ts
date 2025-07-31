import { Product } from '../entities/product.entity';

export interface IProductService {
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | null>;
  getProductsByCategory(category: string): Promise<Product[]>;
  searchProductsByName(name: string): Promise<Product[]>;
  getActiveProducts(): Promise<Product[]>;
  getAvailableProducts(): Promise<Product[]>;
  createProduct(product: Product): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | null>;
  updateProductStock(id: number, newStock: number): Promise<Product | null>;
  deactivateProduct(id: number): Promise<Product | null>;
  deleteProduct(id: number): Promise<boolean>;
}
