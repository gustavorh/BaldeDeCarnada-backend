import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { GetStockByProductIdUseCase } from '../../application/use-cases/get-stock-by-product-id.use-case';
import { GetAllStockUseCase } from '../../application/use-cases/get-all-stock.use-case';
import { GetLowStockItemsUseCase } from '../../application/use-cases/get-low-stock-items.use-case';
import { UpdateStockQuantityUseCase } from '../../application/use-cases/update-stock-quantity.use-case';
import { IncreaseStockUseCase } from '../../application/use-cases/increase-stock.use-case';
import { DecreaseStockUseCase } from '../../application/use-cases/decrease-stock.use-case';

@Controller('api/stock')
export class StockController {
  constructor(
    @Inject(GetStockByProductIdUseCase)
    private readonly getStockByProductIdUseCase: GetStockByProductIdUseCase,
    @Inject(GetAllStockUseCase)
    private readonly getAllStockUseCase: GetAllStockUseCase,
    @Inject(GetLowStockItemsUseCase)
    private readonly getLowStockItemsUseCase: GetLowStockItemsUseCase,
    @Inject(UpdateStockQuantityUseCase)
    private readonly updateStockQuantityUseCase: UpdateStockQuantityUseCase,
    @Inject(IncreaseStockUseCase)
    private readonly increaseStockUseCase: IncreaseStockUseCase,
    @Inject(DecreaseStockUseCase)
    private readonly decreaseStockUseCase: DecreaseStockUseCase,
  ) {}

  @Get()
  async getAllStock() {
    try {
      const stockItems = await this.getAllStockUseCase.execute();
      return {
        success: true,
        data: stockItems.map((stock) => stock.toJSON()),
        message: 'Stock items retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve stock items',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('low-stock')
  async getLowStockItems(@Query('threshold') threshold?: string) {
    try {
      const thresholdValue = threshold ? parseInt(threshold, 10) : 10;
      
      if (isNaN(thresholdValue)) {
        throw new HttpException(
          {
            success: false,
            message: 'Threshold must be a valid number',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const stockItems = await this.getLowStockItemsUseCase.execute(thresholdValue);
      return {
        success: true,
        data: stockItems.map((stock) => stock.toJSON()),
        message: `Stock items below threshold ${thresholdValue} retrieved successfully`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve low stock items',
          error: error.message,
        },
        error.message.includes('cannot be negative') ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('product/:productId')
  async getStockByProductId(@Param('productId', ParseIntPipe) productId: number) {
    try {
      const stock = await this.getStockByProductIdUseCase.execute(productId);
      
      if (!stock) {
        throw new HttpException(
          {
            success: false,
            message: 'Stock not found for this product',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: stock.toJSON(),
        message: 'Stock retrieved successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve stock',
          error: error.message,
        },
        error.message.includes('positive number') ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('product/:productId/update')
  async updateStockQuantity(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() stockData: { quantity: number },
  ) {
    try {
      if (!stockData || stockData.quantity === undefined) {
        throw new HttpException(
          {
            success: false,
            message: 'Quantity is required',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const stock = await this.updateStockQuantityUseCase.execute(productId, stockData.quantity);
      
      if (!stock) {
        throw new HttpException(
          {
            success: false,
            message: 'Stock not found for this product',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: stock.toJSON(),
        message: 'Stock quantity updated successfully',
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
          message: 'Failed to update stock quantity',
          error: error.message,
        },
        isValidationError ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('product/:productId/increase')
  async increaseStock(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() stockData: { quantity: number },
  ) {
    try {
      if (!stockData || stockData.quantity === undefined) {
        throw new HttpException(
          {
            success: false,
            message: 'Quantity is required',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const stock = await this.increaseStockUseCase.execute(productId, stockData.quantity);
      
      if (!stock) {
        throw new HttpException(
          {
            success: false,
            message: 'Stock not found for this product',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: stock.toJSON(),
        message: `Stock increased by ${stockData.quantity} successfully`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const isValidationError = error.message.includes('positive number') || 
                               error.message.includes('must be positive') ||
                               error.message.includes('not found');

      throw new HttpException(
        {
          success: false,
          message: 'Failed to increase stock',
          error: error.message,
        },
        isValidationError ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('product/:productId/decrease')
  async decreaseStock(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() stockData: { quantity: number },
  ) {
    try {
      if (!stockData || stockData.quantity === undefined) {
        throw new HttpException(
          {
            success: false,
            message: 'Quantity is required',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const stock = await this.decreaseStockUseCase.execute(productId, stockData.quantity);
      
      if (!stock) {
        throw new HttpException(
          {
            success: false,
            message: 'Stock not found for this product',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: stock.toJSON(),
        message: `Stock decreased by ${stockData.quantity} successfully`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      const isValidationError = error.message.includes('positive number') || 
                               error.message.includes('must be positive') ||
                               error.message.includes('Insufficient stock') ||
                               error.message.includes('not found');

      throw new HttpException(
        {
          success: false,
          message: 'Failed to decrease stock',
          error: error.message,
        },
        isValidationError ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
