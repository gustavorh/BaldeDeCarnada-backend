import { Module } from '@nestjs/common';
import { OrdersController } from '../../presentation/controllers/orders.controller';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { OrderService } from '../services/order.service';
import { OrderRepository } from '../../infrastructure/repositories/order.repository';

// Use Cases
import { GetAllOrdersUseCase } from '../use-cases/get-all-orders.use-case';
import { GetOrderByIdUseCase } from '../use-cases/get-order-by-id.use-case';

@Module({
  imports: [DatabaseModule],
  controllers: [OrdersController],
  providers: [
    // Services
    OrderService,
    {
      provide: 'OrderService',
      useClass: OrderService,
    },
    
    // Repositories
    OrderRepository,
    {
      provide: 'OrderRepositoryInterface',
      useClass: OrderRepository,
    },
    
    // Use Cases
    GetAllOrdersUseCase,
    GetOrderByIdUseCase,
  ],
  exports: [
    OrderService,
    OrderRepository,
    GetAllOrdersUseCase,
    GetOrderByIdUseCase,
  ],
})
export class OrderModule {}
