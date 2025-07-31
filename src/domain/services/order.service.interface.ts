import { Order } from '../entities/order.entity';

export interface IOrderService {
  getAllOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | null>;
}
