import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserService } from '../services/user.service';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async execute(user: User): Promise<User> {
    return await this.userService.createUser(user);
  }
}
