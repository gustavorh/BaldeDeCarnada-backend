import { User } from '../entities/user.entity';

export interface IUserService {
  getAllUsers(): Promise<User[]>;
}
