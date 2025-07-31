import { Module } from '@nestjs/common';
import { AuthController } from '../../presentation/controllers/auth.controller';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { UserService } from '../services/user.service';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { AuthService } from '../services/auth.service';


@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUseCase,
    AuthService,
    UserService,
    {
      provide: 'AuthService',
      useClass: AuthService,
    },
    UserRepository,
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'UserService',
      useClass: UserService,
    },
  ],
  exports: [RegisterUserUseCase, LoginUseCase, UserService, UserRepository],
})
export class AuthModule {}
