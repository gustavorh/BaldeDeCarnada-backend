import { Inject, Injectable } from '@nestjs/common';
import { ProductService } from '../services/product.service';

@Injectable()
export class UpdateProductStockUseCase {
  constructor(
    @Inject(ProductService)
    private readonly productService: ProductService,
  ) {}

  async execute(id: number, newStock: number): Promise<boolean> {
    if (id <= 0) {
      throw new Error('Product ID must be a positive number');
    }

    if (newStock < 0) {
      throw new Error('Stock quantity cannot be negative');
    }

    const updatedProduct = await this.productService.updateProductStock(id, newStock);
    return updatedProduct !== null;
  }
}
