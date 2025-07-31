import { Inject, Injectable } from '@nestjs/common';
import { Stock } from '../../domain/entities/stock.entity';
import { StockService } from '../services/stock.service';

@Injectable()
export class UpdateStockQuantityUseCase {
  constructor(
    @Inject(StockService)
    private readonly stockService: StockService,
  ) {}

  async execute(productId: number, newQuantity: number): Promise<Stock | null> {
    if (productId <= 0) {
      throw new Error('Product ID must be a positive number');
    }

    if (newQuantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }

    return await this.stockService.updateStock(productId, newQuantity);
  }
}
