import { Injectable, Inject } from '@nestjs/common';
import { StockRepositoryInterface } from '../../domain/repositories/stock.repository.interface';
import { Stock } from '../../domain/entities/stock.entity';
import { stock } from '../database/schema';
import { eq, lt } from 'drizzle-orm';

@Injectable()
export class StockRepository implements StockRepositoryInterface {
  constructor(@Inject('DATABASE') private readonly db: any) {}

  async findByProductId(productId: number): Promise<Stock | null> {
    const result = await this.db
      .select()
      .from(stock)
      .where(eq(stock.productId, productId))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const stockItem = result[0];
    return Stock.create({
      productId: stockItem.productId,
      currentQuantity: stockItem.currentQuantity,
      updatedAt: stockItem.updatedAt ?? new Date(),
    });
  }

  async findAll(): Promise<Stock[]> {
    const result = await this.db.select().from(stock);

    return result.map((stockItem) =>
      Stock.create({
        productId: stockItem.productId,
        currentQuantity: stockItem.currentQuantity,
        updatedAt: stockItem.updatedAt ?? new Date(),
      }),
    );
  }

  async findLowStock(threshold: number): Promise<Stock[]> {
    const result = await this.db
      .select()
      .from(stock)
      .where(lt(stock.currentQuantity, threshold));

    return result.map((stockItem) =>
      Stock.create({
        productId: stockItem.productId,
        currentQuantity: stockItem.currentQuantity,
        updatedAt: stockItem.updatedAt ?? new Date(),
      }),
    );
  }

  async create(stockData: Stock): Promise<Stock> {
    await this.db.insert(stock).values({
      productId: stockData.productId,
      currentQuantity: stockData.currentQuantity,
    });

    // Get the created stock
    const createdStock = await this.findByProductId(stockData.productId);
    if (!createdStock) {
      throw new Error('Failed to create stock');
    }

    return createdStock;
  }

  async updateQuantity(productId: number, newQuantity: number): Promise<Stock | null> {
    if (newQuantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }

    await this.db
      .update(stock)
      .set({ currentQuantity: newQuantity })
      .where(eq(stock.productId, productId));

    return this.findByProductId(productId);
  }

  async increaseStock(productId: number, quantity: number): Promise<Stock | null> {
    if (quantity <= 0) {
      throw new Error('Quantity to increase must be positive');
    }

    const currentStock = await this.findByProductId(productId);
    if (!currentStock) {
      throw new Error('Stock not found for product');
    }

    const newQuantity = currentStock.currentQuantity + quantity;
    return this.updateQuantity(productId, newQuantity);
  }

  async decreaseStock(productId: number, quantity: number): Promise<Stock | null> {
    if (quantity <= 0) {
      throw new Error('Quantity to decrease must be positive');
    }

    const currentStock = await this.findByProductId(productId);
    if (!currentStock) {
      throw new Error('Stock not found for product');
    }

    const newQuantity = currentStock.currentQuantity - quantity;
    if (newQuantity < 0) {
      throw new Error('Insufficient stock');
    }

    return this.updateQuantity(productId, newQuantity);
  }

  async delete(productId: number): Promise<boolean> {
    const result = await this.db
      .delete(stock)
      .where(eq(stock.productId, productId));

    return result[0].affectedRows > 0;
  }
}
