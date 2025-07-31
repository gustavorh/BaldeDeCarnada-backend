import { Order } from '../entities/order.entity';

export interface OrderRepositoryInterface {
  findAll(): Promise<Order[]>;
  findById(id: number): Promise<Order | null>;
}
