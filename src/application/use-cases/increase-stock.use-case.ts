import { Inject, Injectable } from '@nestjs/common';
import { Stock } from '../../domain/entities/stock.entity';
import { StockService } from '../services/stock.service';

@Injectable()
export class IncreaseStockUseCase {
  constructor(
    @Inject(StockService)
    private readonly stockService: StockService,
  ) {}

  async execute(productId: number, quantity: number): Promise<Stock | null> {
    if (productId <= 0) {
      throw new Error('Product ID must be a positive number');
    }

    if (quantity <= 0) {
      throw new Error('Quantity to increase must be positive');
    }

    return await this.stockService.increaseStock(productId, quantity);
  }
}
