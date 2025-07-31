import { Module } from '@nestjs/common';
import { ProductsController } from '../../presentation/controllers/products.controller';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { ProductService } from '../services/product.service';
import { ProductRepository } from '../../infrastructure/repositories/product.repository';

// Use Cases
import { GetAllProductsUseCase } from '../use-cases/get-all-products.use-case';
import { GetProductByIdUseCase } from '../use-cases/get-product-by-id.use-case';
import { GetProductsByCategoryUseCase } from '../use-cases/get-products-by-category.use-case';
import { SearchProductsByNameUseCase } from '../use-cases/search-products-by-name.use-case';
import { GetActiveProductsUseCase } from '../use-cases/get-active-products.use-case';
import { GetAvailableProductsUseCase } from '../use-cases/get-available-products.use-case';
import { CreateProductUseCase } from '../use-cases/create-product.use-case';
import { UpdateProductUseCase } from '../use-cases/update-product.use-case';
import { UpdateProductStockUseCase } from '../use-cases/update-product-stock.use-case';
import { DeactivateProductUseCase } from '../use-cases/deactivate-product.use-case';
import { DeleteProductUseCase } from '../use-cases/delete-product.use-case';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController],
  providers: [
    // Services
    ProductService,
    {
      provide: 'ProductService',
      useClass: ProductService,
    },
    
    // Repositories
    ProductRepository,
    {
      provide: 'ProductRepositoryInterface',
      useClass: ProductRepository,
    },
    
    // Use Cases
    GetAllProductsUseCase,
    GetProductByIdUseCase,
    GetProductsByCategoryUseCase,
    SearchProductsByNameUseCase,
    GetActiveProductsUseCase,
    GetAvailableProductsUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    UpdateProductStockUseCase,
    DeactivateProductUseCase,
    DeleteProductUseCase,
  ],
  exports: [
    ProductService,
    ProductRepository,
    GetAllProductsUseCase,
    GetProductByIdUseCase,
    GetProductsByCategoryUseCase,
    SearchProductsByNameUseCase,
    GetActiveProductsUseCase,
    GetAvailableProductsUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    UpdateProductStockUseCase,
    DeactivateProductUseCase,
    DeleteProductUseCase,
  ],
})
export class ProductModule {}
