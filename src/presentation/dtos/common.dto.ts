import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: true, description: 'Indicates if the operation was successful' })
  success: boolean;

  @ApiProperty({ description: 'Response data' })
  data?: T;

  @ApiProperty({ example: 'Operation completed successfully', description: 'Response message' })
  message: string;

  @ApiProperty({ description: 'Error message (only present when success is false)', required: false })
  error?: string;
}

export class ErrorResponseDto {
  @ApiProperty({ example: false, description: 'Indicates the operation failed' })
  success: boolean;

  @ApiProperty({ example: 'Operation failed', description: 'Error message' })
  message: string;

  @ApiProperty({ description: 'Detailed error information', required: false })
  error?: string;
}
