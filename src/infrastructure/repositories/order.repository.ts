import { Injectable, Inject } from '@nestjs/common';
import { OrderRepositoryInterface } from '../../domain/repositories/order.repository.interface';
import { Order, OrderProduct } from '../../domain/entities/order.entity';
import { orders } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class OrderRepository implements OrderRepositoryInterface {
  constructor(@Inject('DATABASE') private readonly db: any) {}

  async findAll(): Promise<Order[]> {
    const result = await this.db.select().from(orders);

    return result.map((order) => this.mapToOrderEntity(order));
  }

  async findById(id: number): Promise<Order | null> {
    const result = await this.db
      .select()
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this.mapToOrderEntity(result[0]);
  }

  private mapToOrderEntity(orderData: any): Order {
    // Parse the JSON products field
    const products: OrderProduct[] = Array.isArray(orderData.products) 
      ? orderData.products 
      : JSON.parse(orderData.products || '[]');

    return Order.create({
      id: orderData.id,
      products: products,
      orderDate: orderData.orderDate ?? new Date(),
      status: orderData.status,
      total: Number(orderData.total),
      createdAt: orderData.createdAt ?? new Date(),
      updatedAt: orderData.updatedAt ?? new Date(),
    });
  }
}
