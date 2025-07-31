import { ApiProperty } from '@nestjs/swagger';

export class UpdateStockQuantityDto {
  @ApiProperty({ example: 50, description: 'New stock quantity' })
  quantity: number;
}

export class StockResponseDto {
  @ApiProperty({ example: 1, description: 'Stock entry ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: number;

  @ApiProperty({ example: 'Fishing Rod Premium', description: 'Product name' })
  productName: string;

  @ApiProperty({ example: 25, description: 'Current stock quantity' })
  quantity: number;

  @ApiProperty({ example: 5, description: 'Minimum stock level for alerts' })
  minQuantity: number;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Last stock update date' })
  lastUpdated: string;
}
