import { Inject, Injectable } from '@nestjs/common';
import { Stock } from '../../domain/entities/stock.entity';
import { StockService } from '../services/stock.service';

@Injectable()
export class GetLowStockItemsUseCase {
  constructor(
    @Inject(StockService)
    private readonly stockService: StockService,
  ) {}

  async execute(threshold: number = 10): Promise<Stock[]> {
    if (threshold < 0) {
      throw new Error('Threshold cannot be negative');
    }
    
    return await this.stockService.getLowStockItems(threshold);
  }
}
