import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { ProductService } from '../services/product.service';

@Injectable()
export class GetProductByIdUseCase {
  constructor(
    @Inject(ProductService)
    private readonly productService: ProductService,
  ) {}

  async execute(id: number): Promise<Product | null> {
    if (id <= 0) {
      throw new Error('Product ID must be a positive number');
    }
    
    return await this.productService.getProductById(id);
  }
}
