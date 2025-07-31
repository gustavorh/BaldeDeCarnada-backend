import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Fishing Rod Premium', description: 'Product name' })
  name: string;

  @ApiProperty({ example: 'High-quality fishing rod for professional use', description: 'Product description' })
  description: string;

  @ApiProperty({ example: 99.99, description: 'Product price' })
  price: number;

  @ApiProperty({ example: 'fishing-gear', description: 'Product category' })
  category: string;

  @ApiProperty({ example: 10, description: 'Initial stock quantity' })
  stock: number;

  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Product image URL', required: false })
  imageUrl?: string;
}

export class UpdateProductDto {
  @ApiProperty({ example: 'Fishing Rod Premium Updated', description: 'Product name', required: false })
  name?: string;

  @ApiProperty({ example: 'Updated description', description: 'Product description', required: false })
  description?: string;

  @ApiProperty({ example: 109.99, description: 'Product price', required: false })
  price?: number;

  @ApiProperty({ example: 'fishing-gear', description: 'Product category', required: false })
  category?: string;

  @ApiProperty({ example: 'https://example.com/new-image.jpg', description: 'Product image URL', required: false })
  imageUrl?: string;
}

export class UpdateProductStockDto {
  @ApiProperty({ example: 15, description: 'New stock quantity' })
  stock: number;
}

export class ProductResponseDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  id: number;

  @ApiProperty({ example: 'Fishing Rod Premium', description: 'Product name' })
  name: string;

  @ApiProperty({ example: 'High-quality fishing rod for professional use', description: 'Product description' })
  description: string;

  @ApiProperty({ example: 99.99, description: 'Product price' })
  price: number;

  @ApiProperty({ example: 'fishing-gear', description: 'Product category' })
  category: string;

  @ApiProperty({ example: 10, description: 'Current stock quantity' })
  stock: number;

  @ApiProperty({ example: true, description: 'Whether the product is active' })
  isActive: boolean;

  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'Product image URL' })
  imageUrl: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Product creation date' })
  createdAt: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Product last update date' })
  updatedAt: string;
}
