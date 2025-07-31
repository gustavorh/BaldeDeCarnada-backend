import { Module } from '@nestjs/common';
import { AuthController } from '../../presentation/controllers/auth.controller';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { UserService } from '../services/user.service';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { DatabaseModule } from '../../infrastructure/database/database.module';


@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    UserService,
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
  exports: [RegisterUserUseCase, UserService, UserRepository],
})
export class AuthModule {}
