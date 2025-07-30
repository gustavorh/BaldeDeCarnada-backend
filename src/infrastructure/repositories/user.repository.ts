import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UserRepositoryInterface } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { users } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<User[]> {
    const result = await this.databaseService.db.select().from(users);

    return result.map((user) =>
      User.create({
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password,
        isActive: user.isActive ?? true,
        createdAt: user.createdAt ?? new Date(),
        updatedAt: user.updatedAt ?? new Date(),
      }),
    );
  }

  async findById(id: number): Promise<User | null> {
    const result = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const user = result[0];
    return User.create({
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      isActive: user.isActive ?? true,
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.databaseService.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const user = result[0];
    return User.create({
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      isActive: user.isActive ?? true,
      createdAt: user.createdAt ?? new Date(),
      updatedAt: user.updatedAt ?? new Date(),
    });
  }

  async create(
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    const result = await this.databaseService.db.insert(users).values({
      email: userData.email,
      name: userData.name,
      password: userData.password,
      isActive: userData.isActive,
    });

    // Get the created user
    const createdUser = await this.findById(Number(result[0].insertId));
    if (!createdUser) {
      throw new Error('Failed to create user');
    }

    return createdUser;
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    await this.databaseService.db
      .update(users)
      .set({
        ...(userData.email && { email: userData.email }),
        ...(userData.name && { name: userData.name }),
        ...(userData.password && { password: userData.password }),
        ...(userData.isActive !== undefined && { isActive: userData.isActive }),
      })
      .where(eq(users.id, id));

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.databaseService.db
      .delete(users)
      .where(eq(users.id, id));

    return result[0].affectedRows > 0;
  }
}
