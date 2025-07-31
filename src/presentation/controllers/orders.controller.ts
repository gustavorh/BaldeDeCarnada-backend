import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GetAllOrdersUseCase } from '../../application/use-cases/get-all-orders.use-case';
import { GetOrderByIdUseCase } from '../../application/use-cases/get-order-by-id.use-case';
import { OrderResponseDto } from '../dtos/order.dto';
import { ApiResponseDto, ErrorResponseDto } from '../dtos/common.dto';

@ApiTags('orders')
@Controller('api/orders')
export class OrdersController {
  constructor(
    @Inject(GetAllOrdersUseCase)
    private readonly getAllOrdersUseCase: GetAllOrdersUseCase,
    @Inject(GetOrderByIdUseCase)
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ 
    status: 200, 
    description: 'Orders retrieved successfully',
    type: ApiResponseDto<OrderResponseDto[]>
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Failed to retrieve orders',
    type: ErrorResponseDto
  })
  async getAllOrders() {
    try {
      const orders = await this.getAllOrdersUseCase.execute();
      return {
        success: true,
        data: orders.map((order) => order.toJSON()),
        message: 'Orders retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve orders',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Order retrieved successfully',
    type: ApiResponseDto<OrderResponseDto>
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Order not found',
    type: ErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Failed to retrieve order',
    type: ErrorResponseDto
  })
  async getOrderById(@Param('id', ParseIntPipe) id: number) {
    try {
      const order = await this.getOrderByIdUseCase.execute(id);
      
      if (!order) {
        throw new HttpException(
          {
            success: false,
            message: 'Order not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: order.toJSON(),
        message: 'Order retrieved successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve order',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
