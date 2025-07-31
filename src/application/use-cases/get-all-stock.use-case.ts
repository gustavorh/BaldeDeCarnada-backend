import { Inject, Injectable } from '@nestjs/common';
import { Stock } from '../../domain/entities/stock.entity';
import { StockService } from '../services/stock.service';

@Injectable()
export class GetAllStockUseCase {
  constructor(
    @Inject(StockService)
    private readonly stockService: StockService,
  ) {}

  async execute(): Promise<Stock[]> {
    return await this.stockService.getAllStock();
  }
}
