import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { RegisterAttendanceUseCase } from '../../application/use-cases/register-attendance.use-case';
import { AttendanceService } from '../../application/services/attendance.service';
import { CheckInDto, CheckOutDto, AttendanceResponseDto } from '../dtos/attendance.dto';
import { ApiResponseDto, ErrorResponseDto } from '../dtos/common.dto';

@ApiTags('attendance')
@Controller('api/attendance')
export class AttendanceController {
  constructor(
    @Inject(RegisterAttendanceUseCase)
    private readonly registerAttendanceUseCase: RegisterAttendanceUseCase,
    @Inject(AttendanceService)
    private readonly attendanceService: AttendanceService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get attendance records with optional filters' })
  @ApiQuery({ 
    name: 'employeeId', 
    description: 'Filter by employee ID', 
    required: false,
    example: '1'
  })
  @ApiQuery({ 
    name: 'date', 
    description: 'Filter by date (YYYY-MM-DD)', 
    required: false,
    example: '2023-01-01'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Attendance records retrieved successfully',
    type: ApiResponseDto<AttendanceResponseDto[]>
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Failed to retrieve attendance records',
    type: ErrorResponseDto
  })
  async getAllAttendance(@Query('employeeId') employeeId?: string, @Query('date') date?: string) {
    try {
      let attendance;

      if (employeeId && date) {
        const employeeIdNum = parseInt(employeeId);
        const queryDate = new Date(date);
        attendance = [await this.attendanceService.getTodayAttendanceByEmployee(employeeIdNum)];
        attendance = attendance.filter(Boolean); // Remove null values
      } else if (employeeId) {
        const employeeIdNum = parseInt(employeeId);
        attendance = await this.attendanceService.getAttendanceByEmployeeId(employeeIdNum);
      } else if (date) {
        const queryDate = new Date(date);
        attendance = await this.attendanceService.getAttendanceByDate(queryDate);
      } else {
        attendance = await this.attendanceService.getAllAttendance();
      }

      return {
        success: true,
        data: attendance.map((att) => att.toJSON()),
        message: 'Attendance records retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve attendance records',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attendance record by ID' })
  @ApiParam({ name: 'id', description: 'Attendance record ID', example: '1' })
  @ApiResponse({ 
    status: 200, 
    description: 'Attendance record retrieved successfully',
    type: ApiResponseDto<AttendanceResponseDto>
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Attendance record not found',
    type: ErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Failed to retrieve attendance record',
    type: ErrorResponseDto
  })
  async getAttendanceById(@Param('id') id: string) {
    try {
      const attendanceId = parseInt(id);
      const attendance = await this.attendanceService.getAttendanceById(attendanceId);

      if (!attendance) {
        throw new HttpException(
          {
            success: false,
            message: 'Attendance record not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: attendance.toJSON(),
        message: 'Attendance record retrieved successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve attendance record',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('check-in')
  @ApiOperation({ summary: 'Register employee check-in' })
  @ApiBody({ type: CheckInDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Check-in registered successfully',
    type: ApiResponseDto<AttendanceResponseDto>
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Employee ID is required or invalid data',
    type: ErrorResponseDto
  })
  async checkIn(@Body() checkInDto: CheckInDto) {
    try {
      if (!checkInDto || !checkInDto.employeeId) {
        throw new HttpException(
          {
            success: false,
            message: 'Employee ID is required',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const checkInTime = checkInDto.checkInTime ? new Date(checkInDto.checkInTime) : new Date();

      const attendance = await this.registerAttendanceUseCase.execute({
        employeeId: checkInDto.employeeId,
        checkInTime,
      });

      return {
        success: true,
        data: attendance.toJSON(),
        message: 'Check-in registered successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to register check-in',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id/check-out')
  @ApiOperation({ summary: 'Register employee check-out' })
  @ApiParam({ name: 'id', description: 'Attendance record ID', example: '1' })
  @ApiBody({ type: CheckOutDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Check-out registered successfully',
    type: ApiResponseDto<AttendanceResponseDto>
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid data',
    type: ErrorResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Attendance record not found',
    type: ErrorResponseDto
  })
  async checkOut(@Param('id') id: string, @Body() checkOutDto: CheckOutDto) {
    try {
      const attendanceId = parseInt(id);
      const checkOutTime = checkOutDto.checkOutTime ? new Date(checkOutDto.checkOutTime) : new Date();

      const attendance = await this.registerAttendanceUseCase.executeCheckOut(attendanceId, checkOutTime);

      if (!attendance) {
        throw new HttpException(
          {
            success: false,
            message: 'Attendance record not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: attendance.toJSON(),
        message: 'Check-out registered successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to register check-out',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('employee/:employeeId/today')
  @ApiOperation({ summary: 'Get today\'s attendance for specific employee' })
  @ApiParam({ name: 'employeeId', description: 'Employee ID', example: '1' })
  @ApiResponse({ 
    status: 200, 
    description: 'Today\'s attendance retrieved successfully',
    type: ApiResponseDto<AttendanceResponseDto>
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Failed to retrieve today\'s attendance',
    type: ErrorResponseDto
  })
  async getTodayAttendance(@Param('employeeId') employeeId: string) {
    try {
      const employeeIdNum = parseInt(employeeId);
      const attendance = await this.attendanceService.getTodayAttendanceByEmployee(employeeIdNum);

      return {
        success: true,
        data: attendance ? attendance.toJSON() : null,
        message: attendance ? 'Today\'s attendance found' : 'No attendance record for today',
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve today\'s attendance',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete attendance record' })
  @ApiParam({ name: 'id', description: 'Attendance record ID', example: '1' })
  @ApiResponse({ 
    status: 200, 
    description: 'Attendance record deleted successfully',
    type: ApiResponseDto<null>
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Attendance record not found',
    type: ErrorResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Failed to delete attendance record',
    type: ErrorResponseDto
  })
  async deleteAttendance(@Param('id') id: string) {
    try {
      const attendanceId = parseInt(id);
      const deleted = await this.attendanceService.deleteAttendance(attendanceId);

      if (!deleted) {
        throw new HttpException(
          {
            success: false,
            message: 'Attendance record not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        message: 'Attendance record deleted successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: 'Failed to delete attendance record',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
