import { Inject, Injectable } from '@nestjs/common';
import { ProductService } from '../services/product.service';

@Injectable()
export class DeactivateProductUseCase {
  constructor(
    @Inject(ProductService)
    private readonly productService: ProductService,
  ) {}

  async execute(id: number): Promise<boolean> {
    if (id <= 0) {
      throw new Error('Product ID must be a positive number');
    }

    const deactivatedProduct = await this.productService.deactivateProduct(id);
    return deactivatedProduct !== null;
  }
}
