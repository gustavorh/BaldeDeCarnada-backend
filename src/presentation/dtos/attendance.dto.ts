import { ApiProperty } from '@nestjs/swagger';

export class CheckInDto {
  @ApiProperty({ example: 1, description: 'Employee ID' })
  employeeId: number;

  @ApiProperty({ 
    example: '2023-01-01T08:00:00.000Z', 
    description: 'Check-in time (ISO string format)', 
    required: false 
  })
  checkInTime?: string;
}

export class CheckOutDto {
  @ApiProperty({ 
    example: '2023-01-01T17:00:00.000Z', 
    description: 'Check-out time (ISO string format)', 
    required: false 
  })
  checkOutTime?: string;
}

export class AttendanceResponseDto {
  @ApiProperty({ example: 1, description: 'Attendance record ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Employee ID' })
  employeeId: number;

  @ApiProperty({ example: 'John Doe', description: 'Employee name' })
  employeeName: string;

  @ApiProperty({ example: '2023-01-01T08:00:00.000Z', description: 'Check-in time' })
  checkInTime: string;

  @ApiProperty({ 
    example: '2023-01-01T17:00:00.000Z', 
    description: 'Check-out time', 
    required: false 
  })
  checkOutTime?: string;

  @ApiProperty({ example: '2023-01-01', description: 'Date of attendance' })
  date: string;

  @ApiProperty({ 
    example: 480, 
    description: 'Total working minutes (if checked out)', 
    required: false 
  })
  totalMinutes?: number;

  @ApiProperty({ example: '2023-01-01T08:00:00.000Z', description: 'Record creation date' })
  createdAt: string;

  @ApiProperty({ example: '2023-01-01T17:00:00.000Z', description: 'Record last update date' })
  updatedAt: string;
}
