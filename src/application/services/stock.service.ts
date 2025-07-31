import { Inject, Injectable } from '@nestjs/common';
import { IStockService } from '../../domain/services/stock.service.interface';
import { Stock } from '../../domain/entities/stock.entity';
import { StockRepositoryInterface } from '../../domain/repositories/stock.repository.interface';

@Injectable()
export class StockService implements IStockService {
  constructor(
    @Inject('StockRepositoryInterface')
    private readonly stockRepository: StockRepositoryInterface,
  ) {}

  async getStockByProductId(productId: number): Promise<Stock | null> {
    return await this.stockRepository.findByProductId(productId);
  }

  async getAllStock(): Promise<Stock[]> {
    return await this.stockRepository.findAll();
  }

  async getLowStockItems(threshold: number): Promise<Stock[]> {
    if (threshold < 0) {
      throw new Error('Threshold cannot be negative');
    }
    return await this.stockRepository.findLowStock(threshold);
  }

  async updateStock(productId: number, newQuantity: number): Promise<Stock | null> {
    if (newQuantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }

    const existingStock = await this.stockRepository.findByProductId(productId);
    if (!existingStock) {
      throw new Error('Stock not found for product');
    }

    return await this.stockRepository.updateQuantity(productId, newQuantity);
  }

  async increaseStock(productId: number, quantity: number): Promise<Stock | null> {
    if (quantity <= 0) {
      throw new Error('Quantity to increase must be positive');
    }

    const existingStock = await this.stockRepository.findByProductId(productId);
    if (!existingStock) {
      throw new Error('Stock not found for product');
    }

    return await this.stockRepository.increaseStock(productId, quantity);
  }

  async decreaseStock(productId: number, quantity: number): Promise<Stock | null> {
    if (quantity <= 0) {
      throw new Error('Quantity to decrease must be positive');
    }

    const existingStock = await this.stockRepository.findByProductId(productId);
    if (!existingStock) {
      throw new Error('Stock not found for product');
    }

    if (!existingStock.canFulfillOrder(quantity)) {
      throw new Error('Insufficient stock available');
    }

    return await this.stockRepository.decreaseStock(productId, quantity);
  }

  async createStock(stock: Stock): Promise<Stock> {
    if (stock.currentQuantity < 0) {
      throw new Error('Initial stock quantity cannot be negative');
    }

    // Check if stock already exists for this product
    const existingStock = await this.stockRepository.findByProductId(stock.productId);
    if (existingStock) {
      throw new Error('Stock already exists for this product');
    }

    return await this.stockRepository.create(stock);
  }

  async deleteStock(productId: number): Promise<boolean> {
    const existingStock = await this.stockRepository.findByProductId(productId);
    if (!existingStock) {
      throw new Error('Stock not found for product');
    }

    return await this.stockRepository.delete(productId);
  }
}
