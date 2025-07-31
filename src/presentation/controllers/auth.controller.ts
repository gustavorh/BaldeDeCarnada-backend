import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegisterUserUseCase } from 'src/application/use-cases/register-user.use-case';
import { LoginUseCase } from 'src/application/use-cases/login.use-case';
import { RegisterUserDto, LoginDto, UserResponseDto } from '../dtos/auth.dto';
import { ApiResponseDto, ErrorResponseDto } from '../dtos/common.dto';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(
    @Inject(RegisterUserUseCase)
    private readonly registerUserUseCase: RegisterUserUseCase,
    @Inject(LoginUseCase)
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User registered successfully',
    type: ApiResponseDto<UserResponseDto>
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid user data',
    type: ErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Failed to register user',
    type: ErrorResponseDto
  })
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
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    type: ApiResponseDto<UserResponseDto>
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid login credentials',
    type: ErrorResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid email or password',
    type: ErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Failed to login',
    type: ErrorResponseDto
  })
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
