import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { ProductService } from '../services/product.service';

export interface CreateProductDto {
  name: string;
  category: string;
  price: number;
  stock: number;
  isActive?: boolean;
}

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(ProductService)
    private readonly productService: ProductService,
  ) {}

  async execute(productData: CreateProductDto): Promise<Product> {
    // Validate input data
    if (!productData.name || productData.name.trim().length === 0) {
      throw new Error('Product name is required');
    }

    if (!productData.category || productData.category.trim().length === 0) {
      throw new Error('Product category is required');
    }

    if (productData.price <= 0) {
      throw new Error('Product price must be greater than 0');
    }

    if (productData.stock < 0) {
      throw new Error('Product stock cannot be negative');
    }

    // Create product entity
    const product = Product.create({
      id: 0, // Will be set by database
      name: productData.name.trim(),
      category: productData.category.trim(),
      price: productData.price,
      stock: productData.stock,
      isActive: productData.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.productService.createProduct(product);
  }
}
