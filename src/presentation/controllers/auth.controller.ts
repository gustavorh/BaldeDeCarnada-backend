import {
    Body,
    Controller,
    Post,
    HttpException,
    HttpStatus,
    Inject,
} from '@nestjs/common';
import { RegisterUserUseCase } from 'src/application/use-cases/register-user.use-case';

@Controller('api/auth')
export class AuthController {
    constructor(
        @Inject(RegisterUserUseCase)
        private readonly registerUserUseCase: RegisterUserUseCase,
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
    }