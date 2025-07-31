import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { RegisterUserUseCase } from 'src/application/use-cases/register-user.use-case';
import { LoginUseCase } from 'src/application/use-cases/login.use-case';

@Controller('api/auth')
export class AuthController {
  constructor(
    @Inject(RegisterUserUseCase)
    private readonly registerUserUseCase: RegisterUserUseCase,
    @Inject(LoginUseCase)
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  async register(@Body() user: any) {
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
        message: 'User registered successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to register user',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async login(@Body() credentials: any) {
    try {
      const { email, password } = credentials;

      if (!email || !password) {
        throw new HttpException(
          {
            success: false,
            message: 'Invalid login credentials',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.loginUseCase.execute({
        email,
        password,
      });

      if (!user) {
        throw new HttpException(
          {
            success: false,
            message: 'Invalid email or password',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      return {
        success: true,
        data: user.toJSON(),
        message: 'Login successful',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to login',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
