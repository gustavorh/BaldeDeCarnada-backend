import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { ProductService } from '../services/product.service';

export interface UpdateProductDto {
  name?: string;
  category?: string;
  price?: number;
  stock?: number;
  isActive?: boolean;
}

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(ProductService)
    private readonly productService: ProductService,
  ) {}

  async execute(id: number, productData: UpdateProductDto): Promise<Product | null> {
    if (id <= 0) {
      throw new Error('Product ID must be a positive number');
    }

    // Validate input data
    if (productData.name !== undefined && (!productData.name || productData.name.trim().length === 0)) {
      throw new Error('Product name cannot be empty');
    }

    if (productData.category !== undefined && (!productData.category || productData.category.trim().length === 0)) {
      throw new Error('Product category cannot be empty');
    }

    if (productData.price !== undefined && productData.price <= 0) {
      throw new Error('Product price must be greater than 0');
    }

    if (productData.stock !== undefined && productData.stock < 0) {
      throw new Error('Product stock cannot be negative');
    }

    // Prepare update data
    const updateData: any = {};
    
    if (productData.name !== undefined) {
      updateData.name = productData.name.trim();
    }
    
    if (productData.category !== undefined) {
      updateData.category = productData.category.trim();
    }
    
    if (productData.price !== undefined) {
      updateData.price = productData.price;
    }
    
    if (productData.stock !== undefined) {
      updateData.stock = productData.stock;
    }
    
    if (productData.isActive !== undefined) {
      updateData.isActive = productData.isActive;
    }

    return await this.productService.updateProduct(id, updateData);
  }
}
