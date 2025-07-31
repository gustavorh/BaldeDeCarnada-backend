import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.use-case';
import { RegisterUserUseCase } from 'src/application/use-cases/register-user.use-case';
import { UserResponseDto, RegisterUserDto } from '../dtos/auth.dto';
import { ApiResponseDto, ErrorResponseDto } from '../dtos/common.dto';

@ApiTags('users')
@Controller('api/users')
export class UsersController {
  constructor(
    @Inject(GetAllUsersUseCase)
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    @Inject(RegisterUserUseCase)
    private readonly registerUserUseCase: RegisterUserUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ 
    status: 200, 
    description: 'Users retrieved successfully',
    type: ApiResponseDto<UserResponseDto[]>
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Failed to retrieve users',
    type: ErrorResponseDto
  })
  async getAllUsers() {
    try {
      const users = await this.getAllUsersUseCase.execute();
      return {
        success: true,
        data: users.map((user) => user.toJSON()),
        message: 'Users retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve users',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User created successfully',
    type: ApiResponseDto<UserResponseDto>
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid user data',
    type: ErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Failed to create user',
    type: ErrorResponseDto
  })
  async createUser(@Body() user: any) {
    try {
      if (!user || !user.email || !user.name || !user.password) {
        throw new HttpException(
          {
            success: false,
            message: 'Invalid user data',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const createdUser = await this.registerUserUseCase.execute(user);
      return {
        success: true,
        data: createdUser.toJSON(),
        message: 'User created successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to create user',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
