import { Inject, Injectable } from '@nestjs/common';
import { Attendance } from '../../domain/entities/attendance.entity';
import { AttendanceService } from '../services/attendance.service';

export interface RegisterAttendanceRequest {
  employeeId: number;
  checkInTime: Date;
  date?: Date;
}

@Injectable()
export class RegisterAttendanceUseCase {
  constructor(
    @Inject(AttendanceService)
    private readonly attendanceService: AttendanceService,
  ) {}

  async execute(request: RegisterAttendanceRequest): Promise<Attendance> {
    const { employeeId, checkInTime, date } = request;
    
    // If no date is provided, use today's date
    const attendanceDate = date || new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    // Use the checkIn method which includes business logic validation
    return await this.attendanceService.checkIn(employeeId, checkInTime);
  }

  async executeCheckOut(attendanceId: number, checkOutTime: Date): Promise<Attendance | null> {
    return await this.attendanceService.checkOut(attendanceId, checkOutTime);
  }
}
