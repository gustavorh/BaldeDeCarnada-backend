import { Module } from '@nestjs/common';
import { UsersController } from '../../presentation/controllers/users.controller';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.use-case';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { UserService } from '../services/user.service';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { RegisterUserUseCase } from '../use-cases/register-user.use-case';


@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    GetAllUsersUseCase,
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
  exports: [GetAllUsersUseCase, RegisterUserUseCase, UserService, UserRepository],
})
export class UsersModule {}
