import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserService } from '../services/user.service';

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async execute(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }
}
