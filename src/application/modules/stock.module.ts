import { Module } from '@nestjs/common';
import { StockController } from '../../presentation/controllers/stock.controller';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { StockService } from '../services/stock.service';
import { StockRepository } from '../../infrastructure/repositories/stock.repository';

// Use Cases
import { GetStockByProductIdUseCase } from '../use-cases/get-stock-by-product-id.use-case';
import { GetAllStockUseCase } from '../use-cases/get-all-stock.use-case';
import { GetLowStockItemsUseCase } from '../use-cases/get-low-stock-items.use-case';
import { UpdateStockQuantityUseCase } from '../use-cases/update-stock-quantity.use-case';
import { IncreaseStockUseCase } from '../use-cases/increase-stock.use-case';
import { DecreaseStockUseCase } from '../use-cases/decrease-stock.use-case';

@Module({
  imports: [DatabaseModule],
  controllers: [StockController],
  providers: [
    // Services
    StockService,
    {
      provide: 'StockService',
      useClass: StockService,
    },
    
    // Repositories
    StockRepository,
    {
      provide: 'StockRepositoryInterface',
      useClass: StockRepository,
    },
    
    // Use Cases
    GetStockByProductIdUseCase,
    GetAllStockUseCase,
    GetLowStockItemsUseCase,
    UpdateStockQuantityUseCase,
    IncreaseStockUseCase,
    DecreaseStockUseCase,
  ],
  exports: [
    StockService,
    StockRepository,
    'StockRepositoryInterface',
    GetStockByProductIdUseCase,
    GetAllStockUseCase,
    GetLowStockItemsUseCase,
    UpdateStockQuantityUseCase,
    IncreaseStockUseCase,
    DecreaseStockUseCase,
  ],
})
export class StockModule {}
