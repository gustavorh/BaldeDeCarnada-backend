import { Inject, Injectable } from '@nestjs/common';
import { Order } from '../../domain/entities/order.entity';
import { OrderService } from '../services/order.service';

@Injectable()
export class GetOrderByIdUseCase {
  constructor(
    @Inject(OrderService)
    private readonly orderService: OrderService,
  ) {}

  async execute(id: number): Promise<Order | null> {
    if (id <= 0) {
      throw new Error('Order ID must be a positive number');
    }
    
    return await this.orderService.getOrderById(id);
  }
}
