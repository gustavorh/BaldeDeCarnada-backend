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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { GetAllProductsUseCase } from '../../application/use-cases/get-all-products.use-case';
import { GetProductByIdUseCase } from '../../application/use-cases/get-product-by-id.use-case';
import { GetProductsByCategoryUseCase } from '../../application/use-cases/get-products-by-category.use-case';
import { SearchProductsByNameUseCase } from '../../application/use-cases/search-products-by-name.use-case';
import { GetActiveProductsUseCase } from '../../application/use-cases/get-active-products.use-case';
import { GetAvailableProductsUseCase } from '../../application/use-cases/get-available-products.use-case';
import { CreateProductUseCase, CreateProductDto as CreateProductUseCaseDto } from '../../application/use-cases/create-product.use-case';
import { UpdateProductUseCase, UpdateProductDto as UpdateProductUseCaseDto } from '../../application/use-cases/update-product.use-case';
import { UpdateProductStockUseCase } from '../../application/use-cases/update-product-stock.use-case';
import { DeactivateProductUseCase } from '../../application/use-cases/deactivate-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.use-case';
import { ProductResponseDto, UpdateProductStockDto, CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { ApiResponseDto, ErrorResponseDto } from '../dtos/common.dto';

@ApiTags('products')
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
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ 
    status: 200, 
    description: 'Products retrieved successfully',
    type: ApiResponseDto<ProductResponseDto[]>
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Failed to retrieve products',
    type: ErrorResponseDto
  })
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
  @ApiOperation({ summary: 'Get all active products' })
  @ApiResponse({ 
    status: 200, 
    description: 'Active products retrieved successfully',
    type: ApiResponseDto<ProductResponseDto[]>
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Failed to retrieve active products',
    type: ErrorResponseDto
  })
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
  @ApiOperation({ summary: 'Get all available products (with stock > 0)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Available products retrieved successfully',
    type: ApiResponseDto<ProductResponseDto[]>
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Failed to retrieve available products',
    type: ErrorResponseDto
  })
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
  @ApiOperation({ summary: 'Get products by category' })
  @ApiParam({ name: 'category', description: 'Product category', example: 'fishing-gear' })
  @ApiResponse({ 
    status: 200, 
    description: 'Products in category retrieved successfully',
    type: ApiResponseDto<ProductResponseDto[]>
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid category',
    type: ErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Failed to retrieve products by category',
    type: ErrorResponseDto
  })
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
  @ApiOperation({ summary: 'Search products by name' })
  @ApiQuery({ name: 'name', description: 'Product name to search for', example: 'fishing rod' })
  @ApiResponse({ 
    status: 200, 
    description: 'Products matching search criteria retrieved successfully',
    type: ApiResponseDto<ProductResponseDto[]>
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Search name parameter is required',
    type: ErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Failed to search products',
    type: ErrorResponseDto
  })
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
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Product retrieved successfully',
    type: ApiResponseDto<ProductResponseDto>
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Product not found',
    type: ErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Failed to retrieve product',
    type: ErrorResponseDto
  })
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
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Product created successfully',
    type: ApiResponseDto<ProductResponseDto>
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid product data',
    type: ErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Failed to create product',
    type: ErrorResponseDto
  })
  async createProduct(@Body() productData: CreateProductUseCaseDto) {
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
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'Product ID', example: 1 })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Product updated successfully',
    type: ApiResponseDto<ProductResponseDto>
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Product not found',
    type: ErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Failed to update product',
    type: ErrorResponseDto
  })
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() productData: UpdateProductUseCaseDto,
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
  @ApiOperation({ summary: 'Update product stock quantity' })
  @ApiParam({ name: 'id', description: 'Product ID', example: 1 })
  @ApiBody({ type: UpdateProductStockDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Product stock updated successfully',
    type: ApiResponseDto<ProductResponseDto>
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid stock data',
    type: ErrorResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Product not found',
    type: ErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Failed to update product stock',
    type: ErrorResponseDto
  })
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
  @ApiOperation({ summary: 'Deactivate a product' })
  @ApiParam({ name: 'id', description: 'Product ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Product deactivated successfully',
    type: ApiResponseDto<null>
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Product not found',
    type: ErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Failed to deactivate product',
    type: ErrorResponseDto
  })
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
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Product deleted successfully',
    type: ApiResponseDto<null>
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Product not found',
    type: ErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Failed to delete product',
    type: ErrorResponseDto
  })
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
