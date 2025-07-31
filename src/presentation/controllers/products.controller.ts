import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { GetAllProductsUseCase } from '../../application/use-cases/get-all-products.use-case';
import { GetProductByIdUseCase } from '../../application/use-cases/get-product-by-id.use-case';
import { GetProductsByCategoryUseCase } from '../../application/use-cases/get-products-by-category.use-case';
import { SearchProductsByNameUseCase } from '../../application/use-cases/search-products-by-name.use-case';
import { GetActiveProductsUseCase } from '../../application/use-cases/get-active-products.use-case';
import { GetAvailableProductsUseCase } from '../../application/use-cases/get-available-products.use-case';
import { CreateProductUseCase, CreateProductDto } from '../../application/use-cases/create-product.use-case';
import { UpdateProductUseCase, UpdateProductDto } from '../../application/use-cases/update-product.use-case';
import { UpdateProductStockUseCase } from '../../application/use-cases/update-product-stock.use-case';
import { DeactivateProductUseCase } from '../../application/use-cases/deactivate-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.use-case';

@Controller('api/products')
export class ProductsController {
  constructor(
    @Inject(GetAllProductsUseCase)
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
    @Inject(GetProductByIdUseCase)
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    @Inject(GetProductsByCategoryUseCase)
    private readonly getProductsByCategoryUseCase: GetProductsByCategoryUseCase,
    @Inject(SearchProductsByNameUseCase)
    private readonly searchProductsByNameUseCase: SearchProductsByNameUseCase,
    @Inject(GetActiveProductsUseCase)
    private readonly getActiveProductsUseCase: GetActiveProductsUseCase,
    @Inject(GetAvailableProductsUseCase)
    private readonly getAvailableProductsUseCase: GetAvailableProductsUseCase,
    @Inject(CreateProductUseCase)
    private readonly createProductUseCase: CreateProductUseCase,
    @Inject(UpdateProductUseCase)
    private readonly updateProductUseCase: UpdateProductUseCase,
    @Inject(UpdateProductStockUseCase)
    private readonly updateProductStockUseCase: UpdateProductStockUseCase,
    @Inject(DeactivateProductUseCase)
    private readonly deactivateProductUseCase: DeactivateProductUseCase,
    @Inject(DeleteProductUseCase)
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Get()
  async getAllProducts() {
    try {
      const products = await this.getAllProductsUseCase.execute();
      return {
        success: true,
        data: products.map((product) => product.toJSON()),
        message: 'Products retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve products',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('active')
  async getActiveProducts() {
    try {
      const products = await this.getActiveProductsUseCase.execute();
      return {
        success: true,
        data: products.map((product) => product.toJSON()),
        message: 'Active products retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve active products',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('available')
  async getAvailableProducts() {
    try {
      const products = await this.getAvailableProductsUseCase.execute();
      return {
        success: true,
        data: products.map((product) => product.toJSON()),
        message: 'Available products retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve available products',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('category/:category')
  async getProductsByCategory(@Param('category') category: string) {
    try {
      const products = await this.getProductsByCategoryUseCase.execute(category);
      return {
        success: true,
        data: products.map((product) => product.toJSON()),
        message: `Products in category '${category}' retrieved successfully`,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve products by category',
          error: error.message,
        },
        error.message.includes('empty') ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('search')
  async searchProductsByName(@Query('name') name: string) {
    try {
      if (!name) {
        throw new HttpException(
          {
            success: false,
            message: 'Search name parameter is required',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const products = await this.searchProductsByNameUseCase.execute(name);
      return {
        success: true,
        data: products.map((product) => product.toJSON()),
        message: `Products matching '${name}' retrieved successfully`,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to search products',
          error: error.message,
        },
        error.message.includes('empty') || error.message.includes('required') 
          ? HttpStatus.BAD_REQUEST 
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    try {
      const product = await this.getProductByIdUseCase.execute(id);
      
      if (!product) {
        throw new HttpException(
          {
            success: false,
            message: 'Product not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: product.toJSON(),
        message: 'Product retrieved successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve product',
          error: error.message,
        },
        error.message.includes('positive number') ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async createProduct(@Body() productData: CreateProductDto) {
    try {
      if (!productData || !productData.name || !productData.category || productData.price === undefined) {
        throw new HttpException(
          {
            success: false,
            message: 'Invalid product data. Name, category, and price are required',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const product = await this.createProductUseCase.execute(productData);
      return {
        success: true,
        data: product.toJSON(),
        message: 'Product created successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const isValidationError = error.message.includes('required') || 
                               error.message.includes('greater than 0') || 
                               error.message.includes('cannot be negative') ||
                               error.message.includes('already exists');

      throw new HttpException(
        {
          success: false,
          message: 'Failed to create product',
          error: error.message,
        },
        isValidationError ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() productData: UpdateProductDto,
  ) {
    try {
      const product = await this.updateProductUseCase.execute(id, productData);
      
      if (!product) {
        throw new HttpException(
          {
            success: false,
            message: 'Product not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: product.toJSON(),
        message: 'Product updated successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const isValidationError = error.message.includes('positive number') || 
                               error.message.includes('greater than 0') || 
                               error.message.includes('cannot be negative') ||
                               error.message.includes('cannot be empty') ||
                               error.message.includes('already exists') ||
                               error.message.includes('not found');

      throw new HttpException(
        {
          success: false,
          message: 'Failed to update product',
          error: error.message,
        },
        isValidationError ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/stock')
  async updateProductStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() stockData: { stock: number },
  ) {
    try {
      if (!stockData || stockData.stock === undefined) {
        throw new HttpException(
          {
            success: false,
            message: 'Stock value is required',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const success = await this.updateProductStockUseCase.execute(id, stockData.stock);
      
      if (!success) {
        throw new HttpException(
          {
            success: false,
            message: 'Product not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Product stock updated successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const isValidationError = error.message.includes('positive number') || 
                               error.message.includes('cannot be negative') ||
                               error.message.includes('not found');

      throw new HttpException(
        {
          success: false,
          message: 'Failed to update product stock',
          error: error.message,
        },
        isValidationError ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/deactivate')
  async deactivateProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      const success = await this.deactivateProductUseCase.execute(id);
      
      if (!success) {
        throw new HttpException(
          {
            success: false,
            message: 'Product not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Product deactivated successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          message: 'Failed to deactivate product',
          error: error.message,
        },
        error.message.includes('positive number') || error.message.includes('not found')
          ? HttpStatus.BAD_REQUEST 
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    try {
      const success = await this.deleteProductUseCase.execute(id);
      
      if (!success) {
        throw new HttpException(
          {
            success: false,
            message: 'Product not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          message: 'Failed to delete product',
          error: error.message,
        },
        error.message.includes('positive number') || error.message.includes('not found')
          ? HttpStatus.BAD_REQUEST 
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
