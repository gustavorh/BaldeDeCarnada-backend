import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { ProductService } from '../services/product.service';

@Injectable()
export class SearchProductsByNameUseCase {
  constructor(
    @Inject(ProductService)
    private readonly productService: ProductService,
  ) {}

  async execute(name: string): Promise<Product[]> {
    if (!name || name.trim().length === 0) {
      throw new Error('Search name cannot be empty');
    }
    
    return await this.productService.searchProductsByName(name.trim());
  }
}
