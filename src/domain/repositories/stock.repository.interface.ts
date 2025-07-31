import { Stock } from '../entities/stock.entity';

export interface StockRepositoryInterface {
  findByProductId(productId: number): Promise<Stock | null>;
  findAll(): Promise<Stock[]>;
  findLowStock(threshold: number): Promise<Stock[]>; // Products with stock below threshold
  create(stock: Stock): Promise<Stock>;
  updateQuantity(productId: number, newQuantity: number): Promise<Stock | null>;
  increaseStock(productId: number, quantity: number): Promise<Stock | null>;
  decreaseStock(productId: number, quantity: number): Promise<Stock | null>;
  delete(productId: number): Promise<boolean>;
}
