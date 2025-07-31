import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { ProductService } from '../services/product.service';

@Injectable()
export class GetProductsByCategoryUseCase {
  constructor(
    @Inject(ProductService)
    private readonly productService: ProductService,
  ) {}

  async execute(category: string): Promise<Product[]> {
    if (!category || category.trim().length === 0) {
      throw new Error('Category cannot be empty');
    }
    
    return await this.productService.getProductsByCategory(category.trim());
  }
}
