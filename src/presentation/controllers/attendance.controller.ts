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
import { RegisterAttendanceUseCase } from '../../application/use-cases/register-attendance.use-case';
import { AttendanceService } from '../../application/services/attendance.service';

export interface CheckInDto {
  employeeId: number;
  checkInTime?: string; // ISO string format
}

export interface CheckOutDto {
  checkOutTime?: string; // ISO string format
}

@Controller('api/attendance')
export class AttendanceController {
  constructor(
    @Inject(RegisterAttendanceUseCase)
    private readonly registerAttendanceUseCase: RegisterAttendanceUseCase,
    @Inject(AttendanceService)
    private readonly attendanceService: AttendanceService,
  ) {}

  @Get()
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
