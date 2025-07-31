import { Inject, Injectable } from '@nestjs/common';
import { IUserService } from '../../domain/services/user.service.interface';
import { User } from '../../domain/entities/user.entity';
import { UserRepositoryInterface } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async login(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);

    console.log('Password Input:', password);
    console.log('Password Stored:', user?.password);
    if (user && user.password === password) {
      console.log('User authenticated successfully');
      return user;
    }
    return null;
  }
}
