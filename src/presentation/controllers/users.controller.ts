import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.use-case';

@Controller('api/users')
export class UsersController {
  constructor(
    @Inject(GetAllUsersUseCase)
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
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
}
