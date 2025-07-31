import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  async execute(credentials: { email: string; password: string }): Promise<User | null> {
    if (!credentials.email || !credentials.password) {
      throw new Error('Invalid login credentials');
    }

    const user = await this.authService.login(
      credentials.email,
      credentials.password,
    );
    if (user) {
      return user;
    }
    throw new Error('User not found or invalid credentials');
  }
}
