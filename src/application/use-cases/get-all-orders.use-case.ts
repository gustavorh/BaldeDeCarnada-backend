import { Inject, Injectable } from '@nestjs/common';
import { Order } from '../../domain/entities/order.entity';
import { OrderService } from '../services/order.service';

@Injectable()
export class GetAllOrdersUseCase {
  constructor(
    @Inject(OrderService)
    private readonly orderService: OrderService,
  ) {}

  async execute(): Promise<Order[]> {
    return await this.orderService.getAllOrders();
  }
}
