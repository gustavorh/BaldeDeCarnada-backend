import { Inject, Injectable } from '@nestjs/common';
import { Stock } from '../../domain/entities/stock.entity';
import { StockService } from '../services/stock.service';

@Injectable()
export class GetStockByProductIdUseCase {
  constructor(
    @Inject(StockService)
    private readonly stockService: StockService,
  ) {}

  async execute(productId: number): Promise<Stock | null> {
    if (productId <= 0) {
      throw new Error('Product ID must be a positive number');
    }
    
    return await this.stockService.getStockByProductId(productId);
  }
}
