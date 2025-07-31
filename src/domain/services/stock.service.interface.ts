import { Stock } from '../entities/stock.entity';

export interface IStockService {
  getStockByProductId(productId: number): Promise<Stock | null>;
  getAllStock(): Promise<Stock[]>;
  getLowStockItems(threshold: number): Promise<Stock[]>;
  updateStock(productId: number, newQuantity: number): Promise<Stock | null>;
  increaseStock(productId: number, quantity: number): Promise<Stock | null>;
  decreaseStock(productId: number, quantity: number): Promise<Stock | null>;
  createStock(stock: Stock): Promise<Stock>;
  deleteStock(productId: number): Promise<boolean>;
}
