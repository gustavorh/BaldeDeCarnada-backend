import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { ProductService } from '../services/product.service';

@Injectable()
export class GetAvailableProductsUseCase {
  constructor(
    @Inject(ProductService)
    private readonly productService: ProductService,
  ) {}

  async execute(): Promise<Product[]> {
    return await this.productService.getAvailableProducts();
  }
}
