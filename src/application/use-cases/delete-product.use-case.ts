import { Inject, Injectable } from '@nestjs/common';
import { ProductService } from '../services/product.service';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(ProductService)
    private readonly productService: ProductService,
  ) {}

  async execute(id: number): Promise<boolean> {
    if (id <= 0) {
      throw new Error('Product ID must be a positive number');
    }

    return await this.productService.deleteProduct(id);
  }
}
