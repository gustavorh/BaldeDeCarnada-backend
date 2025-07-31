import { Inject, Injectable } from '@nestjs/common';
import { IOrderService } from '../../domain/services/order.service.interface';
import { Order } from '../../domain/entities/order.entity';
import { OrderRepositoryInterface } from '../../domain/repositories/order.repository.interface';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @Inject('OrderRepositoryInterface')
    private readonly orderRepository: OrderRepositoryInterface,
  ) {}

  async getAllOrders(): Promise<Order[]> {
    return await this.orderRepository.findAll();
  }

  async getOrderById(id: number): Promise<Order | null> {
    if (id <= 0) {
      throw new Error('Order ID must be a positive number');
    }

    const order = await this.orderRepository.findById(id);
    
    if (!order) {
      return null;
    }

    // Validate order data integrity
    if (!order.validateTotal()) {
      throw new Error('Order data integrity check failed: total does not match calculated total');
    }

    return order;
  }
}
