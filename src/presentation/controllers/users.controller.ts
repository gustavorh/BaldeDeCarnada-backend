import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.use-case';
import { RegisterUserUseCase } from 'src/application/use-cases/register-user.use-case';

@Controller('api/users')
export class UsersController {
  constructor(
    @Inject(GetAllUsersUseCase)
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    @Inject(RegisterUserUseCase)
    private readonly registerUserUseCase: RegisterUserUseCase,
  ) {}

  @Get()
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
