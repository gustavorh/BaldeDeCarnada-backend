import { Inject, Injectable } from '@nestjs/common';
import { IUserService } from '../../domain/services/user.service.interface';
import { User } from '../../domain/entities/user.entity';
import { UserRepositoryInterface } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async createUser(user: User): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    return await this.userRepository.create(user);
  }
  }
