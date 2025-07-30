import { Module } from '@nestjs/common';
import { UsersController } from '../../presentation/controllers/users.controller';
import { GetAllUsersUseCase } from '../../application/use-cases/get-all-users.use-case';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { UserService } from '../services/user.service';
import { UserRepository } from '../../infrastructure/repositories/user.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    GetAllUsersUseCase,
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
  exports: [GetAllUsersUseCase, UserService, UserRepository],
})
export class UsersModule {}
