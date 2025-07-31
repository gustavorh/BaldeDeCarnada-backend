import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  name: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  password: string;

  @ApiProperty({ example: 'manager', description: 'User role', required: false })
  role?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  password: string;
}

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  name: string;

  @ApiProperty({ example: 'manager', description: 'User role' })
  role: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'User creation date' })
  createdAt: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'User last update date' })
  updatedAt: string;
}
