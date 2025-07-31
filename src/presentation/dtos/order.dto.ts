import { ApiProperty } from '@nestjs/swagger';

export class OrderResponseDto {
  @ApiProperty({ example: 1, description: 'Order ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Customer ID' })
  customerId: number;

  @ApiProperty({ example: 'John Doe', description: 'Customer name' })
  customerName: string;

  @ApiProperty({ 
    example: [
      {
        productId: 1,
        productName: 'Fishing Rod',
        quantity: 2,
        price: 99.99,
        subtotal: 199.98
      }
    ], 
    description: 'Order items' 
  })
  items: OrderItemDto[];

  @ApiProperty({ example: 199.98, description: 'Total order amount' })
  total: number;

  @ApiProperty({ example: 'pending', description: 'Order status' })
  status: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Order creation date' })
  createdAt: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Order last update date' })
  updatedAt: string;
}

export class OrderItemDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: number;

  @ApiProperty({ example: 'Fishing Rod Premium', description: 'Product name' })
  productName: string;

  @ApiProperty({ example: 2, description: 'Quantity ordered' })
  quantity: number;

  @ApiProperty({ example: 99.99, description: 'Unit price' })
  price: number;

  @ApiProperty({ example: 199.98, description: 'Subtotal (quantity × price)' })
  subtotal: number;
}
